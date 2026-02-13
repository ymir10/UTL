// prodduction ready Networker
// use for advance network handeling, and data fetching
//// guide :
////// fetch: improved fetch with retry and timeout, takes url and options, options can include retries and timeout in ms
import puppeteer from 'puppeteer';
import http from 'http';
import https from 'https';
import axios from 'axios';
const CONFIG = {
    errorHandling: {
        mode: 'auto',
        maxRetries: 8,
        minTimeout: 10000, // 10 seconds
        maxTimeout: 300000, // 5 minutes max wait
        factor: 2, // Exponential backoff multiplier
        randomize: true // Add jitter to prevent thundering herd
    },

    // Timeouts - Extended for 100Mbps connection
    timeouts: {
        small: 3000,
        medium: 90000,
        large: 180000,
        navigation: 180000,
        download: 600000, // 10 minutes for 1GB @ 100Mbps
        upload: 1800000 // 30 minutes for large file uploads (1.5GB @ ~1.4MB/s)
    },

    // Rate Limiting - SEQUENTIAL PROCESSING ONLY
    rateLimit: {
        concurrentOperations: 1,  // Keep sequential for stability
        delayBetweenFiles: 3000,  // Reduced from 5000ms (faster processing)
        delayBetweenPages: 8000,   // Reduced from 10000ms
        maxFilesPerSession: 30    // Increased from 20 (more capacity)
    },


  // Memory Management for 12GB VPS
  memory: {
    browserRestartAfter: 20,  // Increased if more Ram available
    forceGarbageCollection: true,
    maxOldSpaceSize: 10240 // 10GB heap 
  },

  // Trace Configuration
  trace: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
    referer: 'https://google.com/',
    startPage: 1,
    maxPages: 10000
  }
};

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000, // Send keep-alive probes every 30s
  maxSockets: 5, // Limit concurrent sockets
  maxFreeSockets: 2, // Keep some sockets ready
  timeout: 60000, // Socket timeout 60s
  scheduling: 'lifo' // Reuse most recently used sockets
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 5,
  maxFreeSockets: 2,
  timeout: 60000,
  scheduling: 'lifo'
});

const Networker = {
    checkNetworkConnectivity: async function () {
        try {
            await axios.get('https://www.google.com', { 
                timeout: 5000,
                httpsAgent
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    
    BrowserManager: class {
        constructor() {
            this.browser = null;
            this.isInitialized = false;
            this.pageCount = 0;
        }

        async initialize() {
            if (this.isInitialized && this.browser) {
                return this.browser;
            }

            try {
                console.log('Initializing Puppeteer browser...');
      
                this.browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage', // Critical for low-memory VPS
                        '--disable-accelerated-2d-canvas',
                        '--disable-gpu',
                        '--disable-software-rasterizer',
                        '--disable-extensions',
                        '--disable-background-networking',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-breakpad',
                        '--disable-component-extensions-with-background-pages',
                        '--disable-features=TranslateUI',
                        '--disable-ipc-flooding-protection',
                        '--disable-renderer-backgrounding',
                        '--mute-audio',
                        '--no-default-browser-check',
                        '--no-first-run',
                        '--disable-default-apps'
                    ],
                // Limit Chromium memory
                    ignoreDefaultArgs: ['--enable-automation']
                });

                this.isInitialized = true;
                this.pageCount = 0;
      
                const memUsage = Networker.getMemoryUsage();
                console.log('Browser initialized successfully', { memory: memUsage });
      
                return this.browser;
            } catch (error) {
                console.error('Failed to initialize browser', error);
                throw error;
            }
        }

        async getPage(url, timeout = CONFIG.timeouts.navigation) {
            const browser = await this.initialize();
            const page = await browser.newPage();

            try {
                // Set user agent
                await page.setUserAgent(CONFIG.trace.userAgent);
      
                // Set viewport to reduce memory
                await page.setViewport({ width: 1280, height: 720 });

                // Block unnecessary resources to save bandwidth and memory
                await page.setRequestInterception(true);
                    page.on('request', (request) => {
                        const resourceType = request.resourceType();
                        // Block images, stylesheets, fonts, media
                        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                            request.abort();
                        } else {
                            request.continue();
                        }
                    });

                console.info(`Navigating to: ${url}`);
                await page.goto(url, { 
                    waitUntil: 'networkidle2', 
                    timeout 
                });

                const content = await page.content();
                await page.close();
      
                this.pageCount++;
      
                // Force GC after every page load
                Networker.forceGarbageCollection();
      
                return content;
            } catch (error) {
                await page.close();
                throw error;
            }
        }

        /**
            * Restart browser to prevent memory leaks
        */
        async restart() {
            console.log('Restarting browser to free memory...');
            await this.close();
            await Utils.sleep(3000); // Give OS time to reclaim memory
            await this.initialize();
            stats.increment('browserRestarts');
            console.log('Browser restarted successfully');
        } 

        /**
            * Check if browser needs restart
        */
        shouldRestart() {
            return this.pageCount >= CONFIG.memory.browserRestartAfter;
        }

        async close() {
            if (this.browser) {
                try {
                    await this.browser.close();
                } catch (error) {
                    logger.warn('Error closing browser', { error: error.message });
                }
                this.browser = null;
                this.isInitialized = false;
                this.pageCount = 0;
                console.info('Browser closed');
            }
        }
    },

    forceGarbageCollection: function(){
        if (CONFIG.memory.forceGarbageCollection && global.gc) {
            global.gc();
            console.log('Forced garbage collection');
        }
    },
    getMemoryUsage: function() {
        const usage = process.memoryUsage();
        return {
            heapUsedMB: Math.round(usage.heapUsed / 1024 / 1024),
            heapTotalMB: Math.round(usage.heapTotal / 1024 / 1024),
            rssMB: Math.round(usage.rss / 1024 / 1024),
            externalMB: Math.round(usage.external / 1024 / 1024)
        };
    }
};


/*
const Networker = {

    fetch: async function (url, options = {}) {
        const retries = options.retries || 3;
        const timeout = options.timeout || 5000;

        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(url, { ...options, signal: controller.signal });
                clearTimeout(id);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response;
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
    }

};
*/
export default Networker;