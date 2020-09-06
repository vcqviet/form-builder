class FbsString {
    random(length = 0): string {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }
}
export default new FbsString();