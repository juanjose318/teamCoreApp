import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})
export class ResultsTableComponent implements OnChanges {

  /**
  * Fetch aliados como input
  */
  @Input() allies: any = [];
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
   * Variables para el paginador
   */
  page = 1;
  pageSize = 4;
  collectionSize;

  /**
   * Atribuir variable esperando input
   */
  ngOnChanges() {
    if (this.tableNumber === 1 && this.allies) {
      this.collectionSize = this.allies.allies.length;
      this.allyCollection = this.allies.allies;
      console.log(this.allyCollection);
    }
  }

  refreshCountries() {
    console.log(this.allyCollection);
    this.allyCollection
      .map((ally, i) => ({ id: i + 1, ...ally }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
