import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configurar-aliados',
  templateUrl: './configurar-aliados.component.html',
  styleUrls: ['./configurar-aliados.component.scss']
})
export class ConfigurarAliadosComponent implements OnInit {
  descriptionBoxText: String = "Herramienta que permite  Habilitar en inhabilitar tanto comercio como un fabriacante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado";

  constructor() { }

  ngOnInit() {
  }

}

// import { Component, OnInit } from "@angular/core";
// import { map } from 'rxjs/operators';

// import {
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from "@angular/forms";
// import { AliadoService } from "src/app/services/aliado/aliado.service";
// import { Subscription } from "rxjs";

// @Component({
//   selector: "app-configuracion-aliados",
//   templateUrl: "configuracion-aliados.component.html",
//   styleUrls: ["./configuracion-aliados.component.scss"],
// })

// // tslint:disable-next-line: class-name
// export class configuracionAliadosComponent implements OnInit {
//   // allies: Aliado[];

//   private allySub: Subscription;
//   /**
//    * Text for component
//    */
//   descriptionBoxText: String =
//     "Herramienta que permite Habilitar en inhabilitar tanto comercio como un fabriacante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado";

//   constructor(
//     private aliadoService: AliadoService
//     ) {}

//   ngOnInit() {
//     this.aliadoService.getAllies();
//    this.allySub = this.aliadoService.getAllyListener().subscribe((allyData) => {
//      console.log(allyData);
//     //  this.allies = allyData.allies;
//    })
//   }

//   buscar(id){
   
//   }
// }
