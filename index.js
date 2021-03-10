const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { memoryTracker } = require('./memoryTracker');

let fileProcessedCount = 0;
let fileWithMatchesCount = 0;
let lineMatchCount = 0;
const filesWithNoMatches = [];

const isFile = (filepath) => {
    const stats = fs.statSync(filepath);
    return stats.isFile();
}

const isNonHiddenPath  = (filepath) => {
    const baseName = path.basename(filepath);
    return baseName[0] !== '.';
}

// this for checking why theres discrepancies between grep output and grep-js output
// const checkForMatchesInGrepResult = (filepath) => {
//     const readInterface = readline.createInterface({
//         input: fs.createReadStream('./result.txt'),
//     });

//     let matchFound = false;

//     const sanitizedFp = filepath.replace('/Users/jianhao/Documents/repos/', '');

//     readInterface.on('line', line => {
//         if (line.includes(sanitizedFp)) {
//             matchFound = true
//         }
//     });

//     readInterface.on('close', () => {
//         if (!matchFound) {
//             filesWithNoMatches.push(sanitizedFp);
//         }
//     });
// }

const searchWord = (filepath, word) => {
    fileProcessedCount++;

    return new Promise(resolve => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filepath),
        });
    
        let lineNumber = 0;
    
        let matchesLineNumber = [];
        
        readInterface.on('line', line => {
            lineNumber++;
            if (line.includes(word)) {
                lineMatchCount++;
                matchesLineNumber.push(lineNumber);
            }
        });
    
        readInterface.on('close', () => {
            if (matchesLineNumber.length > 0) {
                fileWithMatchesCount++;
                console.log('File with matches:', filepath)
                // checkForMatchesInGrepResult(filepath);
                console.log('total lines', lineNumber);
                console.log('line matches', matchesLineNumber);
            }
            resolve();
        });
    })
}

const grep = async (entrypoint, word) => {
    try {
        const entries = fs.readdirSync(entrypoint);
        for (let entry of entries) {
            const absPath = path.resolve(entrypoint, entry);
    
            if (isNonHiddenPath(absPath)) {
                if (isFile(absPath)) {
                    await searchWord(absPath, word);
                } else {
                    await grep(absPath, word);
                }
            }
        }
    } catch (e) {
        console.log(`Error reading ${entrypoint}, ${e.message}`);
    }
    return;
}

const tracker = new memoryTracker;

const filePath = process.argv[2];
const word = process.argv[3];

grep(filePath, word).then(() => {
    console.log('\n');
    console.log(`Search completed for word: "${word}" with entrypoint: "${filePath}"`); 
    console.log('\n');
    console.log(`Total number of files processed: ${fileProcessedCount}`);
    console.log(`Total number of files with matches: ${fileWithMatchesCount}`);
    console.log(`Total number of lines with matches: ${lineMatchCount}`);
    console.log('\n');
    console.log('Files with no matches', filesWithNoMatches);
    console.log('\n');
    tracker.getMemoryUsage();
});
