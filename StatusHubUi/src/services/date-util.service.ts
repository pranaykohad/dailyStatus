import { Injectable } from '@angular/core';
import { SATURDAY, SUNDAY } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class DateUtilService {
  buildCustomDates(start: Date, end: Date): string[] {
    const dateList = [];
    if (end.getTime() - start.getTime() < 0) {
      return;
    }
    while (start.getTime() - end.getTime() <= 0) {
      if (start.getDay() !== SUNDAY && start.getDay() !== SATURDAY) {
        const tempDate = `${
          start.getMonth() + 1
        }/${start.getDate()}/${start.getFullYear()}`;
        dateList.push(this.formatSlashDate(tempDate));
      }
      start.setDate(start.getDate() + 1);
    }
    return dateList;
  }

  buildDateCount(start: Date, end: Date): number {
    let dateCount = 0;
    if (end.getTime() - start.getTime() < 0) {
      return;
    }
    while (start.getTime() - end.getTime() <= 0) {
      if (start.getDay() !== SUNDAY && start.getDay() !== SATURDAY) {
        dateCount++;
      }
      start.setDate(start.getDate() + 1);
    }
    return dateCount;
  }

  formatSlashDate(date: string): string {
    const tokens: string[] = date.split('/');
    return `${this.formatNumToTwoDigit(tokens[0])}/${this.formatNumToTwoDigit(
      tokens[1]
    )}/${tokens[2]}`;
  }

  formatSlashToHyphenDate(date: string): string {
    const tokens: string[] = date.split('/');
    const date1 = `${this.formatNumToTwoDigit(
      tokens[0]
    )}-${this.formatNumToTwoDigit(tokens[1])}-${tokens[2]}`;
    const tns: string[] = date1.split('-');
    return `${tns[2]}-${tns[0]}-${tns[1]}`;
  }

  formatHyphenDateToYM(date: string): string {
    const tokens: string[] = date.split('-');
    return `${this.formatNumToTwoDigit(tokens[0])}-${this.formatNumToTwoDigit(
      tokens[1]
    )}`;
  }

  formatHyphenDate(date: string): string {
    const tokens: string[] = date.split('-');
    return `${this.formatNumToTwoDigit(tokens[0])}-${this.formatNumToTwoDigit(
      tokens[1]
    )}-${this.formatNumToTwoDigit(tokens[2])}`;
  }

  extractYearAndMonth(currentDate: Date): string {
    const date: string = currentDate.toLocaleDateString();
    const tokens: string[] = date.split('/');
    return `${tokens[2]}-${this.formatNumToTwoDigit(tokens[0])}`;
  }

  formatCalDateToDate(currentDate: Date): string {
    const date: string = currentDate.toLocaleDateString();
    const tokens: string[] = date.split('/');
    return `${this.formatNumToTwoDigit(tokens[2])}-${this.formatNumToTwoDigit(
      tokens[0]
    )}-${this.formatNumToTwoDigit(tokens[1])}`;
  }

  formatNumToTwoDigit(value: string): string {
    return value.length === 1 ? '0' + value : value;
  }
}
