import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  selectedCountry;
  selectedAlly;

  constructor(
    private modalService: NgbModal
  ) { }

  open() {
    const modalRef = this.modalService.open(ModalFormComponent);
    modalRef.componentInstance.name = 'World';
  }
  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    this.chosenCountry.emit(country);
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

  cancel() {
    console.log('cancel');

  }

}
