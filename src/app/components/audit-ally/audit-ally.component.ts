import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-ally',
  templateUrl: './audit-ally.component.html',
  styleUrls: ['./audit-ally.component.scss']
})
export class AuditAllyComponent implements OnInit {
  @Input() textAudit: string;
  @Input() audit: any;

  auditCollection;

  page: number = 1;
  pageSize: number = 4;
  collectionSize: number;

  constructor() { }

  ngOnInit() {
  }

}
