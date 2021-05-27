import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-audit-ally',
  templateUrl: './audit-ally.component.html',
  styleUrls: ['./audit-ally.component.scss']
})
export class AuditAllyComponent implements OnChanges {
  @Input() textAudit: string;
  @Input() audit: any;

  auditCollection;

  page: number = 1;
  pageSize: number = 4;
  collectionSize: number;

  constructor() { }

  ngOnChanges() {
    if (this.audit) {
      this.collectionSize = this.audit.audit.length;
      this.auditCollection = this.audit.audit;
    }
  }
}
