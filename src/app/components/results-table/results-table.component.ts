import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnInit, OnChanges {
  /**
  * Allies es el pais del que se tiene que hacer el fetch
  */
@Input() allies;
  @Input() filteredAlly;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();


  private allySub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = ['idAllied', 'creationDate', 'channel', 'route', 'idCountry', 'name',
    'identification', 'contact', 'mail', 'phone', 'description', 'carvajalContact',
    'actions'];
  /**
   * Opciones para tabla de datos tipo datatable
   */
  allyCollection;
  companyConfigCollection = [];
  /**
   * Para condicionar de que componenente se trata
   * 1 = Configuracion aliado
   * 2 = Configuracion socio comercial
   * 3 = Configuracion empresa
   * 4 = Configuracion productos
   * 5 = Trazabilidad
   */
  @Input() tableNumber: number;
  /**
   * Depedencia de modal
   * @param dialog modal
   */
  constructor(
    public dialog: MatDialog,
    public allyService: AliadoService,
    private _snackBar: MatSnackBar
    ) { }
  /**
   * Si es tabla uno y hay un objeto de aliados como input revisar si es de un solo pais o de todos
   */
  ngOnChanges() {
    if (this.tableNumber === 1 && !!this.allies && !this.filteredAlly) {
      if (this.allies === 'ALL') {
        this.allyService.getAllies();
        this.allySub = this.allyService.getAllyListener().subscribe((allyData) => {
          this.isLoading.emit(false);
          this.allyCollection = allyData.allies;
          this.dataSource = new MatTableDataSource<any>(this.allyCollection);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          })
      }
      else {
        this.allyService.getAllyByCountry(this.allies);
        this.allySub = this.allyService.getAllyListener()
          .subscribe((allyData) => {
            this.filteredAlly = null;
            this.isLoading.emit(false);
            this.allyCollection = allyData.allies;
            this.dataSource = new MatTableDataSource<any>(this.allyCollection);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      }
    }
    if (this.tableNumber === 1 && !!this.filteredAlly) {
      const filtered = this.allyCollection.filter(ally => ally.idAllied == this.filteredAlly);
      this.dataSource = new MatTableDataSource<any>(filtered);
      this.filteredAlly = null;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    if (this.tableNumber === 1 && this.allies) {
      this.dataSource = new MatTableDataSource<any>(this.allyCollection);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
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
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '50%',
      data: { ally: selectedAlly }
    });

    dialogRef.afterClosed().subscribe((modifiedAlly) => {
      if (!!modifiedAlly) {
        modifiedAlly = {
          ...modifiedAlly,
          channel: { idChannel : selectedAlly.channel.idChannel },
          route: { idRoute: selectedAlly.route.idRoute }
        };
        this.editedAlly.emit({ modifiedAlly, selectedAlly });
      }
      else {
        this._snackBar.open('Operacion Cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }
  /**
   * Output de el aliado a eliminar
   * @param idAllied Id de Aliado que sera eliminado
   */
  deleteAlly(ally) {
    this.deletedAlly.emit(ally);
  }
}
