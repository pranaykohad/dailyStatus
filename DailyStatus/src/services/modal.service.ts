import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from './../app/modal/add-user/add-user.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalOptions: NgbModalOptions;

  constructor(private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      keyboard: false,
    };
  }

  // openHelpModal(): HelpNavComponent {
  //   const helpModal: NgbModalRef = this.modalService.open(
  //     HelpNavComponent,
  //     this.modalOptions
  //   );
  //   const comp = <HelpNavComponent>helpModal.componentInstance;
  //   return comp;
  // }

  // openAddUserModal(): void {
  //   this.modalService.open(AddUserComponent, this.modalOptions);
  // }
}
