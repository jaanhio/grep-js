# Objective
An attempt in replicating Linux's `grep` command to search all files in a particular file path for the `existence` and `count` of a particular word using nodejs and see how it fare in terms of performance.

Performance is evaluated based on the 2 metrics:
* time taken
* cpu usage & memory usage? not sure how to measure this with `grep` command
---

# How to use
```
node index.js /path/to/directory wordToMatch
```

`time` command is used to measure time taken and `process.memoryUsage()` to determine breakdown of memory used.

# Performance

Task1: Find number of files and lines that contain the word `const` in a current project directory. 

### grep-js result

```
time node index.js . const
```

Output:
```
Search completed for word: "const" with entrypoint: "."


Total number of files processed: 8
Total number of files with matches: 5
Total number of lines with matches: 74


Files with no matches []


Memory usage:
rss: 23.93mb
heapTotal: 5.95mb
heapUsed: 3.88mb
external: 1.11mb
arrayBuffers: 0.68mb

real	0.091
user	0.056
sys	0.018
```
Repeated 2 more times to get the average of time taken:
```
real	0.086
user	0.056
sys	0.019

real	0.087
user	0.056
sys	0.019
```
---

### grep command result
```
time grep const -rwl .
```
Output:
```
./memoryTracker.js
./result.txt
./index.js
./sample-files/hasfoo1.txt
./sample-files/dir1/hasfoo2.txt

real	0.006
user	0.001
sys	0.002
```
Repeated 2 more times to get the average of time taken:
```
real	0.007
user	0.001
sys	0.002

real	0.009
user	0.001
sys	0.002
```
---
That's a huge difference in performance based on time taken alone.
What if we increase the search range?

I repeated the task, this time on the parent directory which contains a total of 47770 files.

---

### grep-js result
```
time node index.js .. const
```
Output:
```
Search completed for word: "const" with entrypoint: ".."


Total number of files processed: 47770
Total number of files with matches: 9646
Total number of lines with matches: 83376


Files with no matches []


Memory usage:
rss: 57.88mb
heapTotal: 39.64mb
heapUsed: 13.07mb
external: 6.35mb
arrayBuffers: 5.92mb

real	20.860
user	14.552
sys	6.253
```

```
real	21.704
user	14.608
sys	6.287
```

```
real	21.730
user	14.928
sys	6.332
```
---

### grep command result

Due to number of matches, i will only be sharing the number of lines matched using `wc -l`.

```
time grep const -rwl ..
```
Output:
```
Number of file with matches: 7116
```

```
real	19.378
user	15.406
sys	2.236
```

```
real	21.198
user	15.149
sys	3.308
```

```
real	18.232
user	15.234
sys	2.030
```
Noticed the difference in number of files with matches? After a bit of investigation, it turned out `grep` did not correctly identify some of the files that contain `const` word. Still not sure what is the cause but this resulted in a difference of 2530 matches found.

What surprised me the most was the time taken. It was almost similar to the time taken by the `grep-js` implementation.

---