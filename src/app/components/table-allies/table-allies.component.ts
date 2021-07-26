import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { AuditService } from 'src/app/services/audit/audit.service';
import * as _ from 'lodash';

import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalAllyFormComponent } from '../modal-ally-form/modal-ally-form.component';

@Component({
  selector: 'app-table-allies',
  templateUrl: './table-allies.component.html',
  styleUrls: ['./table-allies.component.scss'],
})

export class TableAlliesComponent implements OnInit, OnChanges, OnDestroy {
  /**
  * Allies es el pais del que se tiene que hacer el fetch
  */
  @Input() allies;
  @Input() filteredAlly;
  @Input() configurationDone;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() nextStepWithRegistry: EventEmitter<any> = new EventEmitter();
  @Output() createAllyCompanyConfig: EventEmitter<any> = new EventEmitter();


  private allySub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['idAllied', 'creationDate', 'channel.channel', 'route.route', 'idCountry', 'name',
    'identification', 'contact', 'mail', 'phone', 'description', 'carvajalContact',
    'actions'];

  /**
   * Colección
   */
  private allyCollection = [];

  /**
   * Client
   */
  private clientIp;

  constructor(
    public dialog: MatDialog,
    private allyService: AliadoService,
    private auditService: AuditService,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Si es tabla uno y hay un objeto de aliados como input revisar si es de un solo pais o de todos
   */
  ngOnChanges(changes: SimpleChanges) {
    const configurationDone = changes['configurationDone'];
    // Tabla 1 configuracion de aliados, hay objeto aliado y no hay ningun aliado filtrado
    if (!!this.allies && !this.filteredAlly) {
      // Todos los paises
      if (this.allies === 'ALL') {
        this.fetchAllAllies();
        this.updateDatable(this.allyCollection);
      } else {
        // Hay aliado filtrado por pais
        this.fetchAlliesByCountry(this.allies);
      }
    } else if (!!this.filteredAlly) {
      const filtered = this.allyCollection.filter(ally => ally.idAllied == this.filteredAlly);
      this.updateDatable(filtered);
      this.filteredAlly = null;
    }
  }

  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    this.updateDatable(this.allyCollection);

  }

  /**
   * Actualizar tabla
   */
  updateDatable(dataSource) {
    this.dataSource = new MatTableDataSource<any>(dataSource);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.dataSource.sortingDataAccessor = _.get;
    this.dataSource.sort = this.sort;
  }

  /**
   * Llamar todos los aliados
   */
  fetchAllAllies() {
    this.allyService.getAllies();
    this.allySub = this.allyService.getAllyListener().subscribe((allyData) => {
      this.isLoading.emit(false);
      this.allyCollection = allyData.allies;
    });
  }

  /**
   * Llamar aliado por pais
   */
  fetchAlliesByCountry(country) {
    this.allyService.getAllyByCountry(country);
    this.allySub = this.allyService.getAllyListener()
      .subscribe((allyData) => {
        this.filteredAlly = null;
        this.isLoading.emit(false);
        this.allyCollection = allyData.allies;
        this.updateDatable(this.allyCollection);
      });
  }
  /**
  * Abrir Modal para ver descripcion de aliado
  * @param description Descripcion de aliado
  */
  openDialog(description): void {
    const dialogRef = this.dialog.open(ModalDescriptionComponent, {
      width: '25%',
      data: { description: description }
    });
  }

  /**
   * Emite como output el aliado modificado y sin modificar para hacer comparacion en configuracion de aliados
   * @param selectedAlly Aliado a modificar
   */
  editAlly(selectedAlly): void {
    const dialogRef = this.dialog.open(ModalAllyFormComponent, {
      width: '50%',
      data: { ally: selectedAlly }
    });

    dialogRef.afterClosed().subscribe((modifiedAlly) => {
      if (!!modifiedAlly) {
        modifiedAlly = {
          ...modifiedAlly,
          channel: { idChannel: selectedAlly.channel.idChannel },
          route: { idRoute: selectedAlly.route.idRoute }
        };
        this.editedAlly.emit({ modifiedAlly, selectedAlly });
      } else {
        this.showMessage('Operacion Cancelada');
      }
    });
  }

  deleteAlly(toDeleteAlly) {
    this.deletedAlly.emit(toDeleteAlly);
  }

  showMessage(message) {
    this._snackBar.open(message, 'cerrar', {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    this.allySub.unsubscribe();
  }

}
