import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarAliadosComponent } from './pages/configurar-aliados/configurar-aliados.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurarAliadosComponent
    },
    {
        path: 'configAliados',
        loadChildren: './pages/page.module#PageModule'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class AppRoutingModule { }
