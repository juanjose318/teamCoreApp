import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-create-ally',
  templateUrl: './search-create-ally.component.html',
  styleUrls: ['./search-create-ally.component.scss']
})
export class SearchCreateAllyComponent {
  @Input() allies;
  @Output() allySearched: EventEmitter<any> = new EventEmitter();

  selectedCountry: string = '';
  selectedAlly: string = '';

  constructor() { }

  /**
   * TODO: hacer que filtre el array basado en la seleccion del ID
   * @param country 
   */
  filterCountry(country) {
    this.selectedCountry = country;
    console.log(country);
    const result = this.allies.allies.filter(ally => ally.countryId == this.selectedCountry);
    // this.allies = result;
    // Aca empezar el llamado a la base de datos con el parametros country
  }

  filterAlly(allyName){
    this.selectedAlly = allyName;
  }

  searchAlly() {
    this.allySearched.emit(this.selectedAlly);
  }

}
