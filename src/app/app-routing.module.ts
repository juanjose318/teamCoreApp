import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableOverviewExampleComponent } from './components/table/table.component';

const routes: Routes = [
    {
        path: 'configAliados',
        loadChildren: './pages/page.module#PageModule'
    },
    {
        path: 'table',
        component: TableOverviewExampleComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class AppRoutingModule { }
