"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { performance } = require("perf_hooks");
const bubbleSort = require("./bubbleSort");
const heapSort = require("./heapSort");
const insertionSort = require("./insertionSort");
const mergeSort = require("./mergeSort");
const quickSort = require("./quickSort");
const radixSort = require("./radixSort");
const selectionSort = require("./selectionSort");
const testArr = (a, b) => {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
const performanceTest = (sort) => {
    let t1 = performance.now();
    for (let i = 0; i < 10; i++) {
        const arr = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));
        sort(arr);
    }
    let t2 = performance.now();
    return (t2 - t1) / 10000;
};
const test1 = () => {
    let data = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
    const bArr = bubbleSort(data);
    const hArr = heapSort(data);
    const iArr = insertionSort(data);
    const mArr = mergeSort(data);
    const [qArr] = quickSort(data);
    const rArr = radixSort(data);
    const sArr = selectionSort(data);
    const tArr = data.sort((a, b) => a - b);
    console.log(`Bubble Sort: ${testArr(bArr, tArr)}`);
    console.log(`Heap Sort: ${testArr(hArr, tArr)}`);
    console.log(`Insertion Sort: ${testArr(iArr, tArr)}`);
    console.log(`Merge Sort: ${testArr(mArr, tArr)}`);
    console.log(`Quick Sort: ${testArr(qArr, tArr)}`);
    console.log(`Radix Sort: ${testArr(rArr, tArr)}`);
    console.log(`Selection Sort: ${testArr(sArr, tArr)}`);
};
const test2 = () => {
    console.log("********************** TEST 2: Perfomance time **********************");
    const pTimes = [];
    const bTime = performanceTest(bubbleSort);
    console.log("********************** bubble **********************");
    pTimes.push({ n: "buble", t: bTime });
    const hTime = performanceTest(heapSort);
    console.log("********************** heap **********************");
    pTimes.push({ n: "heap", t: hTime });
    const iTime = performanceTest(insertionSort);
    console.log("********************** insertion **********************");
    pTimes.push({ n: "insertion", t: iTime });
    const mTime = performanceTest(mergeSort);
    console.log("********************** merge **********************");
    pTimes.push({ n: "merge", t: mTime });
    const qTime = performanceTest(quickSort);
    console.log("********************** quick **********************");
    pTimes.push({ n: "quick", t: qTime });
    const rTime = performanceTest(radixSort);
    console.log("********************** radix **********************");
    pTimes.push({ n: "radix", t: rTime });
    const sTime = performanceTest(selectionSort);
    console.log("********************** selection **********************");
    pTimes.push({ n: "selection", t: sTime });
    pTimes.sort((a, b) => a.t - b.t);
    console.log(pTimes);
};
test1();
test2();
