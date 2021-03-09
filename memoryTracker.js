class MemoryTracker {
    getMemoryUsage = () => {
        const memoryUsage = process.memoryUsage();
        console.log('Memory usage:')
        for (let key in memoryUsage) {
            console.log(`${key}: ${Math.round(memoryUsage[key] / 1024 / 1024 * 100) / 100}mb`)
        }
    }

    trackAtIntervals = (interval) => {
        const handle = setInterval(() => {
            this.getMemoryUsage();
        }, interval * 1000);

        return handle;
    }
}

module.exports = {
    memoryTracker: MemoryTracker
};