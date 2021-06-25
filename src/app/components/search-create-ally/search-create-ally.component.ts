import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ModalAllyFormComponent } from '../modal-ally-form/modal-ally-form.component';

/**
 * TODO reemplazar EAN por CODIGO
 */
@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCreateAllyComponent {
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
  @Output() chosenCompany: EventEmitter<any> = new EventEmitter();
  @Output() createdAlly: EventEmitter<any> = new EventEmitter();
  /**
   * Colleciones iterables
   */
  allyCollection;
  companyCollection;
  @Input() testCollection;
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
  companyId: string;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private allyService: AliadoService,
    private companyService: CompanyService,
    // private cd: ChangeDetectorRef
  ) { }

  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    this.chosenCountry.emit(country);
    setTimeout(() => {
      this.handleFetchAllies(country);
    }, 0.5);
    setTimeout(() => {
      this.handleFetchCompanies(country);
    }, 1);
  }

  /**
 * @param name id de aliado seleccionado despues de filtrar por pais
 */
  filterAlly(idAllied) {
    this.chosenAlly.emit(idAllied);
  }

  /**
   *  filtrar y autocompletar 
   * @param companyEan Codigo de empresa
   */
  filterByCompanyEan(companyEan) {
    // console.log(companyEan);
    const filtered = this.companyCollection.filter(company => company.companyCode == companyEan);
    filtered.forEach(item => {
      this.companyId = item.idCompany;
      this.companyName = item.companyName;
      if (this.companyId === item.idCompany) {
        this.chosenCompany.emit(this.companyId);
      }
    });
  }

  /**
   * filtrar y autocompletar 
   * @param companyId id de empresa
   */
  filterByCompanyId(companyId) {
    const filtered = this.companyCollection.filter(company => company.idCompany == companyId);
    filtered.forEach(item => {
      this.companyEan = item.companyCode;
      this.companyName = item.companyName;
      if (this.companyId === item.idCompany) {
        this.chosenCompany.emit(this.companyId);
      }
    });
  }
  /**
   * 
   * @param companyArray array de objeto iterado en el momento de la seleccion de empresa
   */
  filterByCompanyName(companyName) {
    // console.log(companyName);
    if (!companyName) {
      this.companyEan = null;
      this.companyId = null;
    }
    const filtered = this.companyCollection.filter(company => company.companyName == companyName);
    filtered.forEach(item => {
      this.companyEan = item.companyCode;
      this.companyId = item.idCompany;
      if (this.companyId === item.idCompany) {
        this.chosenCompany.emit(this.companyId);
      }
    });
  }
  /**
   * Fetch para filtros 
   */
  handleFetchAllies(country) {
    if (country === 'ALL') {
      console.log(country);
      this.allyService.getAllies();
      this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
        this.allyCollection = alliesData.allies;
        console.log(this.allyCollection);
      });
    }
    else {
      this.allyService.getAllyByCountry(country);
      this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
        this.allyCollection = alliesData.allies;
        console.log(this.allyCollection);
      });
    }
  }

  handleFetchCompanies(country) {
    if (country === 'ALL') {
      this.companyService.getCompanies();
      this.companySub = this.companyService.getCompanyListener().subscribe((company) => {
        this.companyName = null;
        this.companyEan = null;
        this.companyId = null;
        this.companyCollection = company.companies;
      });
    } else {
      this.companyService.getCompaniesByCountry(country);
      this.companySub = this.companyService.getCompanyListener().subscribe((companyData) => {
        this.companyCollection = companyData.companies;
        if (this.companyCollection.length === 0) {
          this.companyName = null;
          this.companyEan = null;
          this.companyId = null;
        }
      });
    }
  }
  /**
   * Modal para creacion de nuevo aliado
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalAllyFormComponent, {
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

  ngOnDestroy(): void {
    // this.allySub.unsubscribe();
    // this.companySub.unsubscribe();
  }

}
