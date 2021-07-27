import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ModalAllyFormComponent } from '../modal-ally-form/modal-ally-form.component';


@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchCreateAllyComponent implements OnChanges, OnDestroy {

  /**
   * Inputs
   */
  @Input() isConfiginfoSending: boolean;
  @Input() allies;
  @Input() hasRegistry: any;
  @Input() hasSelectedComercialPartners: boolean;
  @Input() hasUploadedFile: boolean;

  /**
   * Outputs
   */
  @Output() chosenCountry: EventEmitter<any> = new EventEmitter();
  @Output() chosenAlly: EventEmitter<any> = new EventEmitter();
  @Output() chosenCompany: EventEmitter<any> = new EventEmitter();
  @Output() createdAlly: EventEmitter<any> = new EventEmitter();
  @Output() cancelConfiguration: EventEmitter<any> = new EventEmitter();
  @Output() saveConfiguration: EventEmitter<any> = new EventEmitter();

  /**
   * Colleciones iterables
   */
  private allyCollection;
  private companyCollection;
  @Input() testCollection;

  /**
   * Subscripciones
   */
  private allySub: Subscription;
  private companySub: Subscription;

  /**
  * Filtros
  */
  private selectedCountry;
  private selectedAlly;

  /**
   * Autofill empresa
   */
  companyName: string;
  companyCode: number;
  companyId: string;

  /**
   * Condicional para habilitar el boton de guardar
   */
  isButtonEnabled;
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private allyService: AliadoService,
    private companyService: CompanyService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['allies'];

    if (change) {
      if (change.currentValue !== null) {
        this.handleFetchAllies(change.currentValue);
        this.handleFetchCompanies(change.currentValue);
      } else {
        return;
      }
    } else if (!!this.hasRegistry.registry.idAlliedCompanyConfig) {
      this.isButtonEnabled = true;
    } else if (this.hasRegistry.hasRegistry && this.hasSelectedComercialPartners && this.hasUploadedFile) {
      this.isButtonEnabled = true;
    } else {
      this.isButtonEnabled = false;
    }
  }

  /**
   * @param country pais seleccionado en la busqueda de aliados
   */
  filterCountry(country) {
    this.chosenCountry.emit(country);
    this.cd.markForCheck();
    this.selectedAlly = null;
    this.companyName = null;
    this.companyCode = null;
    this.companyId = null;
  }

  /**
 * @param name id de aliado seleccionado despues de filtrar por pais
 */
  filterAlly(idAllied) {
    this.chosenAlly.emit(idAllied);
  }

  /**
   *  filtrar y autocompletar 
   * @param companyCode Codigo de empresa
   */
  filterByCompanyCode(companyCode) {
    const filtered = this.companyCollection.filter(company => company.companyCode == companyCode);
    filtered.forEach(item => {
      this.companyId = item.idCompany;
      this.companyName = item.companyName;
      if (this.companyId === item.idCompany) {
        this.chosenCompany.emit(this.companyId);
      }
    });
    this.cd.markForCheck();
  }

  /**
   * filtrar y autocompletar 
   * @param companyId id de empresa
   */
  filterByCompanyId(companyId) {
    const filtered = this.companyCollection.filter(company => company.idCompany == companyId);
    filtered.forEach(item => {
      this.companyCode = item.companyCode;
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
    if (!companyName) {
      this.companyCode = null;
      this.companyId = null;
    }
    const filtered = this.companyCollection.filter(company => company.companyName == companyName);
    filtered.forEach(item => {
      this.companyCode = item.companyCode;
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
      this.allyService.getAllies();
      this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
        this.allyCollection = alliesData.allies;
      });
    } else {
      this.allyService.getAllyByCountry(country);
      this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
        this.allyCollection = alliesData.allies;
      });
    }
    this.cd.markForCheck();
  }

  handleFetchCompanies(country) {
    if (country === 'ALL') {
      this.fetchAllCompanies();
      this.cd.markForCheck();
    } else {
      this.fetchCompaniesByCountry(country);
      this.cd.markForCheck();
    }
  }

  fetchCompaniesByCountry(country) {
    if (country !== 'ALL') {
      if (country !== null) {
        this.companyService.getCompaniesByCountry(country);
        this.companySub = this.companyService.getCompanyListener().subscribe((companyData) => {
          this.companyCollection = companyData.companies;
          if (this.companyCollection.length === 0) {
            this.companyName = null;
            this.companyCode = null;
            this.companyId = null;
          }
        });
      }
    }
  }

  fetchAllCompanies() {
    this.companyService.getCompanies();
    this.companySub = this.companyService.getCompanyListener().subscribe((companyData) => {
      this.companyCollection = companyData.companies;
      this.companyName = null;
      this.companyCode = null;
      this.companyId = null;
    });
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
          channel: { idChannel: 2 },
          route: { idRoute: 1 },
          idState: 1
        };
        this.createdAlly.emit(result);
        this._snackBar.open('La informacion se almaceno satisfactoriamente', 'cerrar', {
          duration: 2000,
        });
      } else {
        this._snackBar.open('Operación cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }

  /**
  * Cancelar los registros
  */
  cancel() {
    this.isButtonEnabled = false;
    this.cancelConfiguration.emit(true);
  }

  /**
   * Guardar Configuraciones
   */
  saveConfig() {
    this.saveConfiguration.emit(true);
  }

  ngOnDestroy(): void {
    if (this.allySub || this.companySub) {
      this.allySub.unsubscribe();
      this.companySub.unsubscribe();
    }

  }
}
