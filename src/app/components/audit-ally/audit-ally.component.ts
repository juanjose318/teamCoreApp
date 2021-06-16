import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuditService } from 'src/app/services/audit/audit.service';

@Component({
  selector: 'app-audit-ally',
  templateUrl: './audit-ally.component.html',
  styleUrls: ['./audit-ally.component.scss']
})
export class AuditAllyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() textAudit: string;
  @Input() audit: any;

  auditCollection;

  /**
 * Opciones para tabla de datos tipo datatable
 */
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    public auditService: AuditService,
  ) { }


  ngOnChanges() {
    if (!!this.audit) {
    this.auditCollection = this.audit.audit;
    }
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [[5, 10, 20, 30, 40, 50], [5, 10, 20, 30, 40, 50]],
      searching: false,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json'
      },
      dom: 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          text: 'Descargar Archivo',
          className: 'btn-download',
          titleAttr: 'Copy'
        }
      ],
    };
    this.auditService.getAuditListener().pipe(
      takeUntil(this.dtTrigger)
    ).subscribe((data) => {
      this.auditCollection = data.audit;
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
