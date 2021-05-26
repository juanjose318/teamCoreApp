import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Aliado } from 'src/app/models/aliado.interface';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsTableComponent implements OnChanges {
  @Input() allies: any = [];
  allyCollection;

  /**
   * Variables para el paginador
   */
  page = 1;
  pageSize = 4;
  collectionSize;

  constructor() {
   }

   /**
    * Atribuir variable esperando input
    */
   ngOnChanges(){
     if(this.allies){
      this.collectionSize = this.allies.allies.length;
      this.allyCollection = this.allies.allies;
      console.log(this.allyCollection);
     }
   }

  refreshCountries() {
    console.log(this.allyCollection);
    this.allyCollection
      .map((ally, i) => ({id: i + 1, ...ally}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
