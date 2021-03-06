import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatRadioModule } from '@angular/material';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    imports: [
        MatDialogModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatCheckboxModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatTooltipModule
    ],
    exports: [
        MatDialogModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatTooltipModule
    ],
    declarations: [],
    providers: [],
})
export class MaterialModule { }
