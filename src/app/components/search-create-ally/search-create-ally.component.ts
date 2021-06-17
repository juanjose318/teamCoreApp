import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss']
})
export class SearchCreateAllyComponent implements OnChanges {

  @Input() isConfiginfoSending: boolean;
  @Input() allies;

  allyCollection;

  private allySub: Subscription;

  @Output() chosenCountry: EventEmitter<any> = new EventEmitter();
  @Output() chosenAlly: EventEmitter<any> = new EventEmitter();
  @Output() createdAlly: EventEmitter<any> = new EventEmitter();

  selectedCountry;
  selectedAlly;

  closeModal;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private allyService: AliadoService
  ) { }

  ngOnChanges() {
    console.log(this.allyCollection)

    if (!!this.allies) {
      this.allyService.getAllyByCountry(this.allies);
      this.allySub = this.allyService.getAllyListener().subscribe((alliesByCountry) => {
        this.allyCollection = alliesByCountry.allies;

      });
    }
  }
  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    console.log(country);
    this.chosenCountry.emit(country);
  }

  /**
 * @param name nombre de aliado seleccionado despues de filtrar por pais
 */
  filterAlly(name): void {
    this.chosenAlly.emit(name);
  }

  /**
   * Modal para creacion de nuevo aliado
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '50%',
      maxHeight: '90vh',
      id: 'a-create-ally-modal'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        result = {
          ...result,
          channel: { idChannel: 1 },
          route: { idRoute: 1 }
        }
        this.createdAlly.emit(result);
        this._snackBar.open('La informacion se almaceno satisfactoriamente', 'cerrar', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Operacion cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }

}
