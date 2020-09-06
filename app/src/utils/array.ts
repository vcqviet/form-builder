class FbsArray {
    compareArrays(first: Array<string>, second: Array<string>): boolean {
        return first.every((e) => second.includes(e)) && second.every((e) => first.includes(e));
    }
}

export default new FbsArray();