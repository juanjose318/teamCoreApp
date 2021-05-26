import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';

@Component({
  selector: 'app-configurar-aliados',
  templateUrl: './configurar-aliados.component.html',
  styleUrls: ['./configurar-aliados.component.scss']
})
export class ConfigurarAliadosComponent implements OnInit {
  private allies: any;
  private allySub: Subscription;

  descriptionBoxText: String = "Herramienta que permite  Habilitar en inhabilitar tanto comercio como un fabriacante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado";

  constructor(
    private aliadoService: AliadoService
  ) { }

ngOnInit() {
    this.aliadoService.getAllies();
    this.allySub = this.aliadoService.getAllyListener()
      .subscribe((allyData) => {
        this.allies = allyData.allies;
        console.log(allyData.allies);
      });
  }

  handleSearch(parameters) {
    console.log(parameters);
  }
}
