import { ICalEvent } from './../model/cal-event';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/timegrid';
import { DatePicker } from 'src/app/model/datePicker';
import { LocalStorageService } from 'src/services/local-storage.service';
import { StatusService } from 'src/services/status.service';
import { UserService } from 'src/services/user.service';
import { UtilService } from 'src/services/util.service';
import { stateList } from '../app.constant';
import { DefaulterListComponent } from '../modal/defaulter-list/defaulter-list.component';
import { WsrReportComponent } from '../modal/wsr-report/wsr-report.component';
import { Attachment } from '../model/attachment';
import { User } from '../model/user';
import { numOfStatus } from './../app.constant';
import { Alert } from './../model/alert';
import { Status } from './../model/status';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  alert: Alert;
  user: User;
  stateList;
  statusList: Status[];
  recentDate: DatePicker;
  recentStatus: Status[];
  alertTimeout: any;
  today: DatePicker;
  userList: User[];
  todaysStatus: Status[];
  message: string;
  editStatus = false;
  editLeavePlan = false;
  events: ICalEvent[];
  calendarOptions: CalendarOptions;
  @ViewChild('defComp') defComp: DefaulterListComponent;
  @ViewChild('wsrReportComp') wsrReportComp: WsrReportComponent;

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private localStoreService: LocalStorageService,
    private router: Router,
    private utilService: UtilService
  ) {
    this.alert = new Alert(null, null);
    this.user = this.localStoreService.getUser();
    this.stateList = stateList;
    this.recentStatus = [];
    this.resetStatusList();
    const today = new Date();
    this.today = new DatePicker(
      today.getMonth() + 1,
      today.getDate(),
      today.getFullYear()
    );
  }

  ngOnInit(): void {
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      initialView: 'dayGridMonth',
      weekends: false,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
    };

    if (!this.userService.getLocalUserName()) {
      this.router.navigateByUrl('/');
    } else {
      this.setRecentDate();
      this.getRecentStatus();
      this.getAllUser();
    }
  }

  editLeavePlan1() {
    this.editStatus = false;
    this.editLeavePlan = true;
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      headerToolbar: {
        left: 'dayGridMonth,timeGridWeek,timeGridDay',
        center: 'title',
        right: 'prev,next today',
      },
      initialView: 'dayGridMonth',
      weekends: false,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
    };
    this.events = [
      {
        eventId: 1,
        title: 'All Day Event1',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 2,
        title: 'All Day Event2',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 3,
        title: 'All Day Event3',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 4,
        title: 'All Day Event4',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 5,
        title: 'All Day Event5',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 6,
        title: 'All Day Event6',
        start: '2021-03-01',
        end: null,
      },
      { eventId: 7, title: 'All Day Event7', start: '2021-03-01', end: null },
      {
        eventId: 8,
        title: 'All Day Event8',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 9,
        title: 'All Day Event9',
        start: '2021-03-01',
        end: null,
      },
      { eventId: 10, title: 'All Day Event10', start: '2021-03-01', end: null },
      {
        eventId: 11,
        title: 'All Day Event11',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 11,
        title: 'All Day Event12',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 13,
        title: 'All Day Event13',
        start: '2021-03-01',
        end: null,
      },
      {
        eventId: 14,
        title: 'All Day Event11',
        start: '2021-03-02',
        end: null,
      },
      {
        eventId: 15,
        title: 'All Day Event12',
        start: '2021-03-02',
        end: null,
      },
      {
        eventId: 16,
        title: 'All Day Event13',
        start: '2021-03-02',
        end: null,
      },
      {
        eventId: 17,
        title: 'All Day Event14',
        start: '2021-03-02',
        end: null,
      },
      {
        eventId: 18,
        title: 'All Day Event15',
        start: '2021-03-02',
        end: null,
      },
      {
        eventId: 19,
        title: 'Long Event',
        start: '2021-01-07',
        end: null,
      },
      {
        eventId: 20,
        title: 'Repeating Event',
        start: '2021-01-09',
        end: null,
      },
      {
        eventId: 21,
        title: 'Repeating Event',
        start: '2021-01-16',
        end: null,
      },
      {
        eventId: 22,
        title: 'Conference',
        start: '2021-01-11',
        end: null,
      },
    ];
  }

  changeState(index: number, row: Status) {
    row.state = this.stateList[index];
  }

  submitStatus() {
    if (!this.statusList.length) {
      return;
    }
    const statusList: Status[] = [];
    let isStsLenCorrect = true;
    isStsLenCorrect = this.buildStatusList(isStsLenCorrect, statusList);
    if (!isStsLenCorrect) {
      return;
    } else if (statusList.length) {
      this.statusService.updateStatus(statusList).subscribe((res) => {
        if (res['description'] === 'Status saved successfully') {
          this.resetStatusList();
        }
        this.alertHandler({ message: res['description'], type: res['status'] });
      });
    } else {
      this.alertHandler({
        message: 'Cannot submit. Empty description',
        type: 'fail',
      });
    }
  }

  resetStatusList() {
    this.statusList = [];
    this.message = null;
    this.editStatus = false;
    this.editLeavePlan = false;
    const date = new Date().toLocaleDateString();
    for (let row = 1; row <= numOfStatus; row++) {
      this.statusList.push(
        new Status(
          '',
          '',
          'In progress',
          this.utilService.formatToTwoDigit(date),
          this.user
        )
      );
    }
  }

  alertHandler(alert: Alert) {
    this.alert = {
      message: alert.message,
      type: alert.type,
    };
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.alert = new Alert(null, '');
    }, 5000);
  }

  logout() {
    this.localStoreService.resetLocalStorage();
    this.router.navigateByUrl('/');
  }

  todaysReport() {
    this.statusService
      .getTodaysReport(
        `${this.today.month}/${this.today.day}/${this.today.year}`
      )
      .subscribe((res) => {
        const alert = this.downloadReport(res);
        this.alertHandler(alert);
      });
  }

  getAllUser() {
    this.userList = [];
    this.userService.getAllUser().subscribe((res) => {
      if (res['status'] === 'FAILURE') {
        const alert = { message: res['description'], type: res['status'] };
        this.alertHandler(alert);
      } else {
        this.userList = res['data'];
      }
    });
  }

  getTodaysStatus() {
    if (this.editStatus) {
      return;
    }
    this.statusList = [];
    this.editStatus = true;
    this.editLeavePlan = false;
    const today: string = `${this.today.month}/${this.today.day}/${this.today.year}`;
    this.statusService
      .statusByDateAndUserId(today, this.user.userId)
      .subscribe((res) => {
        if (res['data']) {
          this.statusList = res['data'];
          this.message = null;
        } else {
          this.message = 'No Status Found';
        }
      });
  }

  initDefList() {
    this.defComp.defaulterList = [];
    this.defComp.message = '';
  }

  clearLeaveReport() {
    const a: HTMLInputElement = document.querySelector('#leaveReport');
    if (a) {
      a.value = null;
    }
    this.wsrReportComp.selectedSheetName = null;
    this.wsrReportComp.sheetNames = [];
  }

  private setRecentDate() {
    const recentDate = new Date();
    const todaysDay = new Date().getDay();
    if (todaysDay === 1) {
      recentDate.setDate(recentDate.getDate() - 3);
    } else if (todaysDay === 0) {
      recentDate.setDate(recentDate.getDate() - 2);
    } else {
      recentDate.setDate(recentDate.getDate() - 1);
    }
    this.recentDate = new DatePicker(
      recentDate.getMonth() + 1,
      recentDate.getDate(),
      recentDate.getFullYear()
    );
  }

  private getRecentStatus() {
    const yesterday: string = `${this.recentDate.month}/${this.recentDate.day}/${this.recentDate.year}`;
    this.statusService
      .statusByDateAndUserId(yesterday, this.user.userId)
      .subscribe((res) => {
        if (res['data']) {
          this.recentStatus = res['data'];
        }
      });
  }

  private buildStatusList(
    isStsLenCorrect: boolean,
    statusList: Status[]
  ): boolean {
    this.statusList.forEach((status) => {
      if (status.description.trim().length) {
        status.description = status.description.trim();
        status.description = this.utilService.removeComma(status.description);
        status.ticketId = status.ticketId ? status.ticketId.trim() : null;
        if (status.description.length > 250) {
          this.alertHandler({
            message: 'Description cannot be more than 250 characters',
            type: 'fail',
          });
          isStsLenCorrect = false;
        }
        statusList.push(status);
      } else if (!status.description.trim().length && this.editStatus) {
        statusList = [];
        isStsLenCorrect = true;
      }
    });
    return isStsLenCorrect;
  }

  private downloadReport(res: any): Alert {
    let alert = null;
    if (res['data']) {
      const data = res['data'];
      const attachment: Attachment = new Attachment(
        data['filename'],
        data['fileContent'],
        data['mimeType']
      );
      this.utilService.downloadFile(attachment);
      alert = {
        message: 'Report downloaded successfully',
        type: 'success',
      };
    } else {
      alert = {
        message: res['description'],
        type: res['status'],
      };
    }
    return alert;
  }
}
