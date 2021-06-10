import { Component, Input, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss']
})
export class ConfigTabsComponent implements OnInit {
  tableNumber = 2;
  constructor() { }

  beforeChange($event: NgbTabChangeEvent) {
    switch ($event.nextId) {
      case 'tab-2':
        this.tableNumber = 2;
        break;
      case 'tab-3':
        this.tableNumber = 3;
        break;
      case 'tab-4':
        this.tableNumber = 4;
        break;
      default:
        this.tableNumber = 2;
    }
  }

  ngOnInit() {
  }

}
