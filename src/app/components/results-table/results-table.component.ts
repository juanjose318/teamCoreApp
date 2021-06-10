import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnInit {
  /**
  * Fetch aliados como input
  */
  @Input() allies;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();

  /**
   * Opciones para tabla de datos tipo datatable
   */
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

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
    if (this.tableNumber === 1 && this.allies) {
      this.allyCollection = this.allies.allies;
    }
  }
  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
      },
      lengthMenu: [[5, 10, 20, 30, 40, 50], [5, 10, 20, 30, 40, 50]],
      // searching: false
    };
    if (this.tableNumber === 1 && this.allies) {
      this.allyService.getAllyListener().pipe(
        takeUntil(this.dtTrigger)
      ).subscribe((data) => {
        this.allyCollection = data.allies;
        console.log(this.allyCollection);
        this.dtTrigger.next();
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
