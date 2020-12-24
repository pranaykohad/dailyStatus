import { Injectable } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from 'src/app/modal/add-user/add-user.component';
import { DefaulterListComponent } from 'src/app/modal/defaulter-list/defaulter-list.component';
import { User } from 'src/app/model/user';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalOptions: NgbModalOptions;

  constructor(private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
  }

  openDefaulterListModal() {
    this.modalService.open(DefaulterListComponent, this.modalOptions);
  }

  openAdduserModal() {
    const addUserModal: NgbModalRef = this.modalService.open(
      AddUserComponent,
      this.modalOptions
    );
    const comp = <AddUserComponent>addUserModal.componentInstance;
    return comp;
  }

  // openAddUserModal(): void {
  //   this.modalService.open(AddUserComponent, this.modalOptions);
  // }
}
