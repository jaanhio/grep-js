// this will be implementing a simple version of grep function
// e.g node index.js '/path/to/dir' 'wordToMatch'
// output: return list of files containing the matching word and which lines they are on

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { memoryTracker } = require('./memoryTracker');

let fileProcessedCount = 0;
let fileWithMatchesCount = 0;
let lineMatchCount = 0;

const isFile = (path) => {
    const stats = fs.statSync(path);
    return stats.isFile();
}

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
            console.log('Processed:', filepath)
            
            if (matchesLineNumber.length > 0) {
                fileWithMatchesCount++;
                console.log('total lines', lineNumber);
                console.log('line matches', matchesLineNumber);
            }
            resolve();
        });
    })
}

const wordSearch = async (entrypoint, word) => {
    try {
        const entries = fs.readdirSync(entrypoint);
        for (let entry of entries) {
            const absPath = path.resolve(entrypoint, entry);
    
            if (isFile(absPath)) {
                await searchWord(absPath, word);
            } else {
                await wordSearch(absPath);
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

wordSearch(filePath, word).then(() => {
    console.log('\n');
    console.log('Search completed!'); 
    console.log('\n');
    console.log(`Total number of files processed: ${fileProcessedCount}`);
    console.log(`Total number of files with matches: ${fileWithMatchesCount}`);
    console.log(`Total number of lines with matches: ${lineMatchCount}`);
    console.log('\n');
    tracker.getMemoryUsage();
});
