import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbAlertModule,
  NgbModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { AddUserComponent } from './modal/add-user/add-user.component';
import { AlertComponent } from './modal/alert/alert.component';
import { DefaulterListComponent } from './modal/defaulter-list/defaulter-list.component';
import { DeleteUserComponent } from './modal/delete-user/delete-user.component';
import { CustomReportComponent } from './modal/report/custom-report.component';
import { UserDetailComponent } from './modal/user-detail/user-detail.component';
import { WsrReportComponent } from './modal/wsr-report/wsr-report.component';

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
    UserDetailComponent,
    CustomReportComponent,
    AddUserComponent,
    AlertComponent,
    DefaulterListComponent,
    DeleteUserComponent,
    WsrReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
