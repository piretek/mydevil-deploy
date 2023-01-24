export const compareObjectFilter: <T>(initialObject: T, ...keys: (keyof T)[]) => (objectToCompare: T) => boolean = (initialObject, ...keys) => (objectToCompare) => {
    const result = keys.every(key => {
        console.log('Checking', key, { initialObject: initialObject[key], objectToCompare: objectToCompare[key] });
        return initialObject[key] === objectToCompare[key];
    });
    console.log('Result for', objectToCompare, 'against', initialObject, 'is', result);
    return result;
}
