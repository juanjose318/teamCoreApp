import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss']
})
export class SearchCreateAllyComponent implements OnChanges {
  /**
   * Inputs
   */
  @Input() isConfiginfoSending: boolean;
  @Input() allies;
  /**
   * Outputs
   */
  @Output() chosenCountry: EventEmitter<any> = new EventEmitter();
  @Output() chosenAlly: EventEmitter<any> = new EventEmitter();
  @Output() createdAlly: EventEmitter<any> = new EventEmitter();
  /**
   * Colleciones iterables
   */
  allyCollection;
  companyCollection;
  /**
   * Subscripciones
   */
  private allySub: Subscription;
  private companySub: Subscription;
  /**
  * Filtros
  */
  selectedCountry;
  selectedAlly;
  /**
   * Autofill empresa
   */
  companyName: string;
  companyEan: number;
  companyId: number;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private allyService: AliadoService,
    private companyService: CompanyService
  ) { }

  /**
   * Verificar si la variable objeto tiene contenido y luego si es el filtro es TODOS
   */
  ngOnChanges() {

    if (!!this.allies) {
      if (this.allies === 'ALL') {
        this.allyService.getAllies();
        this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
          this.allyCollection = alliesData.allies;
        })
      } else {
        this.allyService.getAllyByCountry(this.allies);
        this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
          this.allyCollection = alliesData.allies;
        });
      }
    }
    this.companyService.getCompanies();
    this.companySub = this.companyService.getCompanyListener()
      .subscribe((companyData) => {
        this.companyCollection = companyData.companies;
        console.log(this.companyCollection);
      })
  }
  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    console.log(country);
    this.chosenCountry.emit(country);
  }

  /**
 * @param name id de aliado seleccionado despues de filtrar por pais
 */
  filterAlly(idAllied) {
    this.chosenAlly.emit(idAllied);
  }

  filterByCompanyEan() {

  }

  filterByCompanyId() {

  }

  filterByCompanyName(company) {
    this.companyEan = company.companyEan;
    this.companyId = company.companyId;
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
