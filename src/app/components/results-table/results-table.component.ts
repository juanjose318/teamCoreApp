import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  @Input() everyAlly;

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();

  private allySub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = [ 'idAllied', 'creationDate', 'channel', 'route', 'idCountry',
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
    public allyService: AliadoService) { }


  ngOnChanges() {
    if (this.tableNumber === 1 && !!this.allies) {
      this.allyService.getAllyByCountry(this.allies);
      this.allySub = this.allyService.getAllyListener()
        .subscribe((allyData) => {
          this.allyCollection = allyData.allies;
          this.dataSource = new MatTableDataSource<any>(this.allyCollection);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    }

    if (!!this.filteredAlly) {
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.destroy();
    //   this.allyCollection = this.filteredAlly.allies;
    //   this.dtTrigger.next();
    // });
      this.allyCollection = this.filteredAlly.allies;
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
      width: '50%',
      data: { description: description }
    });
  }

/**
 * @param filterValue Palabra que se escribe la barra de busqueda
 */
  applyFilter(filterValue) {
    console.log(filterValue.target.value);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}

  editAlly(selectedAlly): void {
    const dialogRef = this.dialog.open(ModalFormComponent, {
      width: '50%',
      data: { ally: selectedAlly }
    });

    dialogRef.afterClosed().subscribe((modifiedAlly) => {
      if (!!modifiedAlly) {
        this.editedAlly.emit({ modifiedAlly, selectedAlly });
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
