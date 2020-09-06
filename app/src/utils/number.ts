class FbsNumber {
    prefix(number: any = 0, size: number = 2, char: string = '0'): string {
        for (var i = 0; i < size - (number + '').length; i++) {
            number = char + '' + number;
        }
        return number;
    }
}
export default new FbsNumber();