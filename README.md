# Objective
An attempt in replicating Linux's `grep` command to search all files in a particular file path for the `existence` and `count` of a particular word using nodejs and see how it fare in terms of performance. 

Performance is evaluated based on the 2 metrics:
* time taken
* cpu usage?
---

# How to use
`node index.js /path/to/directory wordToMatch`

`time` command is used to measure time taken and `process.memoryUsage()` to determine breakdown of memory used.




