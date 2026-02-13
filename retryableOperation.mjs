//  production ready RetryableOperation function
import { readline } from "readline";
function onfailedOperation() {
    console.error('Operation failed after maximum retries');
}
async function waitForUserInputFunction(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(`\n${message}\nPress Enter to retry or type 'skip' to skip this operation: `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().trim());
        });
    });
}
async function retryableOperation(operation, oprationValuesObject = {}, operationName = 'retryableOperation', waitForUserInput = false, maxRetries = 0, delay = 1000, delayIncrementFactor = 2, rethrowError = false, timeout = 0, retryfailedOperation = null, maxDelay = 300000) {
    let retries = 0;
    let currentDelay = delay;
    while (true) {
        retries++;
        try {
            const result = await Promise.race([
                operation(oprationValuesObject),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout))
            ]);
            return result; // Operation succeeded, return the result
        } catch (error) {
            console.error(`\n!!! ERROR in ${operationName} : ${error.message}  !!!`);
            if (maxRetries > 0 && retries >= maxRetries) {
            
            if(waitForUserInput){   
                const userResponse = await waitForUserInputFunction(`Operation failed with error: ${error.message}. Type 'skip' to skip, or press Enter to retry.`);
                if (userResponse === 'skip') {
                    console.log(`Skipping operation...\n`);
                    if (rethrowError) {
                        throw error;
                    }else{
                        return false;
                    }
                } else {
                    continue;
                }

            }




                if (rethrowError) {
                    throw error;
                } else {
                    return false;
                }
            }
                if (retryfailedOperation) {
                    try {
                        await retryfailedOperation(error, retries, oprationValuesObject);
                    } catch (retryError) {
                        console.error(`Error in retryfailedOperation: ${retryError.message}`);
                        throw retryError;
                    }
                }
            console.log(`Retrying ${operationName} (Attempt ${retries}${maxRetries > 0 ? ` of ${maxRetries}` : ''}) after ${currentDelay}ms...`);
            

            //console.error(`\n!!! ERROR in ${operationName} !!!`);
            //console.error("Error:", error.message);
            // await new Promise(resolve => setTimeout(resolve, 60000));
            //const userResponse = await waitForUserInput(`${operationName} failed. Fix the issue if possible.`);
            
            //if (userResponse === 'skip') {
            //    console.log(`Skipping ${operationName}...\n`);
            //    throw error;
            //} else {
            //    console.log(`Retrying ${operationName}...\n`);
            //}
        }
    
    await new Promise(resolve => setTimeout(resolve, currentDelay));
    currentDelay = Math.min(currentDelay*delayIncrementFactor, maxDelay);
    }
}









/* written by AI
// use for retrying operations that may fail due to transient issues such as network errors, rate limits, or temporary unavailability of resources
// guide :
// RetryableOperation(operation, options)
// operation: an async function that performs the desired operation and returns a promise
// options: an object containing settings for retry behavior such as maxRetries, delay, backoffFactor, and timeout

async function RetryableOperation(operation, options = {}) {
    const {
        maxRetries = 5,
        delay = 1000,
        backoffFactor = 2,
        timeout = 30000
    } = options;

    let attempt = 0;
    let currentDelay = delay;

    while (attempt < maxRetries) {
        try {
            const result = await Promise.race([
                operation(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout))
            ]);
            return result; // Operation succeeded, return the result
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                throw new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`);
            }
            console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${currentDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, currentDelay));
            currentDelay *= backoffFactor; // Exponential backoff
        }
    }
}
*/
export default retryableOperation;
