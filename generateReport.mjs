// production ready report generator
import Texter from './texter.mjs';
function formatTags(tags) {
    return tags
      .map(tag => `#${tag.replace(/-/g, '')}`)
      .map(tag => tag.replace(/ /g, ''))
      .map(tag => tag.replace(/Teen/i, 'Teens'))
      .map(tag => tag.replace(/#BBC/i, '#BBC #Black'))
      .join(' ');
  }
function generateReport(metadata, fileCode, availableQualities , uploadResultvidnest, channelName = 'RedLuv') {
    let sanitizedTitle = Texter.sanitizeString(metadata.title)
      .replaceAll(/\[|\]/g, '')
      .replaceAll(/&amp;/g, '&')
      .replaceAll(/-/g, ' ');
    for(const star of metadata.stars){
      sanitizedTitle = sanitizedTitle.replace(star, '').trim();
    }
    for(const channel of metadata.channels){
      sanitizedTitle = sanitizedTitle.replaceAll(channel, '').trim();
    }

    const timePrefix = metadata.publishDate.includes('2026')
      ? `New 2026` // `New ${metadata.publishDate}`
      : `New 2026`; // metadata.publishDate

    const formattedTags = formatTags(metadata.tags);
    // const lulu_quality = availableQualities[0].name == '2160' ? '- Support me By Watching here in 4K MUCH LOVE ❤️' : (availableQualities[0].name == '1080') ? '- Support me By Watching here in 2K MUCH LOVE ❤️' : '- Support me By Watching here MUCH LOVE ❤️';
    const lulu_quality = availableQualities[0].name == '2160' ? '- 4K -> ' : (availableQualities[0].name == '1080') ? '- 2K ->' : '->';
    const R_formattedTags = formattedTags.replace(' #Undressing','').replace(' #Couples','').replace(' #FakeTits','').replace(' #OneOnOne','').replace(' #StoryMovies','').replace('  #Undressing','').replace(' #DyedHair','').replace(' #Rich','').replace(' #PrisonCell','').replace(' #BootyShorts','').replace(' #Family','');
    return `{${timePrefix} ${metadata.stars.join(', ')}, ${metadata.channels.join(', ')}, ${sanitizedTitle} ${lulu_quality}} -> {https://luluvdo.com/e${fileCode}, https://vidnest.io/embed-${uploadResultvidnest}.html} #Artporn ${R_formattedTags} #${channelName}`;
  }



/*
// use for generating reports in various formats (txt, json, csv, html) with customizable templates and styling options
// guide :
// generateReport(data, format, options)
// data: the data to be included in the report (object or array)
// format: the desired format of the report (txt, json, csv, html)
// options: an object containing additional settings for report generation such as template, styling, and output path

function generateReport(data, format = 'txt', options = {}) {
    switch (format.toLowerCase()) {
        case 'txt':
            return generateTxtReport(data, options);
        case 'json':
            return generateJsonReport(data, options);
        case 'csv':
            return generateCsvReport(data, options);
        case 'html':
            return generateHtmlReport(data, options);
        default:
            throw new Error('Unsupported report format');
    }
}

function generateTxtReport(data, options) {
    // Simple text report generation logic
    let report = '';
    if (Array.isArray(data)) {
        data.forEach(item => {
            report += JSON.stringify(item) + '\n';
        });
    } else {
        report = JSON.stringify(data, null, 2);
    }
    return report;
}

function generateJsonReport(data, options) {
    return JSON.stringify(data, null, 2);
}

function generateCsvReport(data, options) {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array for CSV format');
    }
    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
    return csv;
}

function generateHtmlReport(data, options) {
    let html = '<html><head><style>';
    html += options.style || '';
    html += '</style></head><body>';
    if (Array.isArray(data)) {
        html += '<table><tr>';
        Object.keys(data[0]).forEach(header => {
            html += `<th>${header}</th>`;
        });
        html += '</tr>';
        data.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(value => {
                html += `<td>${value}</td>`;
            });
            html += '</tr>';
        });
    } else {
        html += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    html += '</body></html>';
    return html;
}
*/
export default generateReport;