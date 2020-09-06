import number from './number';

export type DateRank = {
    from: string,
    to: string
}

class FbsDateTime {
    FORMAT_DATE: string = 'YYYY-MM-DD';
    getCurrentDate() {
        return new Date();
    }
    getCurrentDateString(character: string = '-') {
        return this.getDateString(this.getCurrentDate(), character);
    }
    getDateString(date: Date, character: string = '-') {
        return date.getFullYear() + character + number.prefix(date.getMonth() + 1) + character + number.prefix(date.getDate());
    }
    getNextDateString(days: number = 0, character: string = '-') {
        const currentDate = this.getCurrentDate();
        currentDate.setDate(currentDate.getDate() + days);
        return this.getDateString(currentDate, character);
    }
}

export default new FbsDateTime();