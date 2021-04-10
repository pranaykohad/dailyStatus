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

  removeComma(description: string): string {
    return description.replace(/,/g, '.');
  }

  isSatOrSun(): boolean {
    const today = new Date();
    return today.getDay() === SATURDAY || today.getDay() === SUNDAY;
  }

  removeDupliFrmList(halfDayLeaves: any[]): any[] {
    return halfDayLeaves.filter((array, index, self) => {
      return index === self.findIndex((t) => t.leaveId === array.leaveId);
    });
  }

  changeElementBGColor(prevBtn: HTMLButtonElement, color: string) {
    prevBtn.style.backgroundColor = color;
    prevBtn.style.borderColor = color;
  }
}
