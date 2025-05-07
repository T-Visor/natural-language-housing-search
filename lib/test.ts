const page: number = 2;
const pageSize: number = 5;
const elements: number[] = [1, 2, 3, 4, 5, 6, 7];

const start: number = (page - 1) * pageSize;
const end: number = start + pageSize;
const totalPages: number = Math.ceil(elements.length / pageSize);

console.log(elements.slice(start, end));
console.log(`Number of pages: ${totalPages}`)