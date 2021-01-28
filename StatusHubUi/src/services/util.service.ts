import { Injectable } from '@angular/core';
import { SATURDAY, SUNDAY } from 'src/app/app.constant';
import { Attachment } from 'src/app/model/attachment';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  downloadFile(res: Attachment) {
    const contentType = res.mimeType;
    const urlCreator = window.URL;
    const byteString = window.atob(res.fileContent);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: contentType });
    const url = urlCreator.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = res.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  formatToTwoDigit(date: string): string {
    const tokens: string[] = date.split('/');
    return `${this.formatDate(tokens[0])}/${this.formatDate(tokens[1])}/${
      tokens[2]
    }`;
  }

  removeComma(description: string): string {
    return description.replace(/,/g, '.');
  }

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
        dateList.push(this.formatToTwoDigit(tempDate));
      }
      start.setDate(start.getDate() + 1);
    }
    return dateList;
  }

  private formatDate(value: string): string {
    return value.length === 1 ? '0' + value : value;
  }
}
