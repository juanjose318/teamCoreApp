import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-config',
  templateUrl: './audit-config.component.html',
  styleUrls: ['./audit-config.component.scss']
})
export class AuditConfigComponent implements OnChanges {
  @Input() textAudit: string;
  @Input() audit: any;

  auditCollection;

  page = 1;
  pageSize = 4;
  collectionSize;

  constructor() { }

  ngOnChanges() {
    if (this.audit) {
      this.collectionSize = this.audit.audit.length;
      this.auditCollection = this.audit.audit;
    }
  }

}
