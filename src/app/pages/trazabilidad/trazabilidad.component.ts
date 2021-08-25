import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TraceService } from 'src/app/services/trace/trace.service';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.component.html',
  styleUrls: ['./trazabilidad.component.scss']
})
export class TrazabilidadComponent implements OnInit {
  // tslint:disable-next-line: max-line-length
  textBox = 'Herramienta que permite ejecutar una trazabilidad, consultando la metadata de cada uno de los archivos generados y enviados al Aliado ya sea del fabricante o del comercio';
  searchParams;
  traceCollection;
  isLoading: boolean;

  constructor(
    private traceService: TraceService
  ) { }

  ngOnInit() {
  }

  handleSearch(params) {
    this.isLoading = true;
    this.searchParams = params;
  }

  handleIsloading(loading) {
    (loading === true) ? this.isLoading = true : this.isLoading = false
  }
}
