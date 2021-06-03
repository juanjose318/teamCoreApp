import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss']
})
export class SearchCreateAllyComponent {
  @Input() isConfiginfoSending: boolean;
  @Input() allies;

  @Output() chosenCountry: EventEmitter<any> = new EventEmitter();
  @Output() chosenAlly: EventEmitter<any> = new EventEmitter();
  @Output() createdAlly: EventEmitter<any> = new EventEmitter();

  selectedCountry;
  selectedAlly;

  closeModal;

  constructor(
    public dialog: MatDialog
  ) { }
  // modalRef.componentInstance.title = 'Crear Aliado';
  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    this.chosenCountry.emit(country);
  }

  /**
   * Modal
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '30%',
      id: 'a-create-ally-modal'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        console.log(result);
        this.createdAlly.emit(result);
      }
    });
  }

  /**
   * @param name nombre de aliado seleccionado despues de filtrar por pais
   */
  filterAlly(name) {
    this.chosenAlly.emit(name);
  }

  saveAlly() {
    console.log('save');
  }
}
