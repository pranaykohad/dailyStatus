import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbAlertModule,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from 'primeng/dragdrop';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarComponent } from './full-calendar/full-calendar.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AlertComponent } from './modal/alert/alert.component';
import { CustomReportComponent } from './modal/custom-report/custom-report.component';
import { DefaulterListComponent } from './modal/defaulter-list/defaulter-list.component';
import { DeleteUserComponent } from './modal/delete-user/delete-user.component';
import { ResourceUilityComponent } from './modal/resource-utility/resource-utility.component';
import { UserConsoleComponent } from './modal/user-console/user-console.component';
import { DateFormatPipe } from './pipe/date-format.pipe';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    CustomReportComponent,
    AlertComponent,
    DefaulterListComponent,
    DeleteUserComponent,
    ResourceUilityComponent,
    DateFormatPipe,
    FullCalendarComponent,
    UserConsoleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgbModule,
    FullCalendarModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
