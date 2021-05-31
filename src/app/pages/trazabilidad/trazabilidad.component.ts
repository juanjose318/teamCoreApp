import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.scss']
})
export class TrazabilidadComponent implements OnInit {
  // tslint:disable-next-line: max-line-length
  textBox = 'Herramienta que permite ejecutar una trazabilidad, consultando la meta data de caa uno de los archivos generados y enviados al Aliado ya sea del fabricante o del comercio';
  tableNumber = 5;
  constructor() { }

  ngOnInit() {
  }

}
