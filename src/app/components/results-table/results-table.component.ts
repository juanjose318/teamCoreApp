import { Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnChanges {
  /**
  * Fetch aliados como input
  */
  @Input() allies;

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
  /**
   * TODO pagination
   */
  ngOnChanges() {
    if (this.tableNumber === 1 && this.allies) {
      this.allyCollection = this.allies.allies;
      this.collectionSize = this.allyCollection.length;
    }
  }

  refreshCountries() {
    this.allyCollection
      .map((ally, i) => ({ id: i + 1, ...ally }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      console.log(this.allyCollection);

  }

}
