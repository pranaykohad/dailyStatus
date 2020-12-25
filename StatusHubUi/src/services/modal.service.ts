import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor() {
    // this.modalOptions = {
    //   backdrop: 'static',
    //   keyboard: false,
    // };
  }

  // openDefaulterListModal() {
  //   this.modalService.open(DefaulterListComponent, this.modalOptions);
  // }

  // openAdduserModal() {
  //   const addUserModal: NgbModalRef = this.modalService.open(
  //     AddUserComponent,
  //     this.modalOptions
  //   );
  //   const comp = <AddUserComponent>addUserModal.componentInstance;
  //   return comp;
  // }

  // openAddUserModal(): void {
  //   this.modalService.open(AddUserComponent, this.modalOptions);
  // }
}
