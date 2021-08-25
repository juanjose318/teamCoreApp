import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { SearchParams } from 'src/app/models/searchParams';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { AuditService } from 'src/app/services/audit/audit.service';
import { CompanyService } from 'src/app/services/company/company.service';

@Component({
    selector: 'app-search-trace',
    templateUrl: 'search-trace.component.html',
    styleUrls: ['./search-trace.component.scss'],
})

export class SearchTraceComponent implements OnInit, OnDestroy {
    constructor(
        private companyService: CompanyService,
        private allyService: AliadoService,
        private auditService: AuditService,
        private cd: ChangeDetectorRef,
        private _snackBar: MatSnackBar
    ) { }

    @Output() searchParams: EventEmitter<SearchParams> = new EventEmitter<SearchParams>();
    /**
    * Filtros
    */
    selectedCountry;
    selectedAlly;
    companyType;
    selectedCompany;
    /**
    * Subscripciones
    */
    allySub: Subscription;
    companySub: Subscription;
    auditSub: Subscription;
    /**
     * Colecciones
     */
    companyCollection;
    allyCollection;

    ngOnInit() {
        this.auditSub = new Subscription;
        this.companySub = new Subscription;
        this.allySub = new Subscription;
    }

    submitSearch() {
        const params: SearchParams = { idAlly: this.selectedAlly, idCompany: this.selectedCompany }
        if (params.idAlly && params.idCompany) {
            this.searchParams.emit(params)
        } else {
            this._snackBar.open('Campos requeridos no han sido seleccionados', 'cerrar', {
                duration: 2000,
            });
        }
    }

    filterCountry(country) {
        this.handleFetchAllies(country);
        this.selectedCountry = country;
    }

    handleFetchCompanies(country) {
        if (country === 'ALL') {
            this.fetchAllCompanies();
        } else {
            this.fetchCompaniesByCountry(country);
        }
    }

    fetchCompaniesByCountry(country) {
        if (country !== 'ALL') {
            this.companyService.getCompaniesByCountry(country);
            this.companySub = this.companyService.getCompanyListener().subscribe((companyData) => {
                this.companyCollection = companyData.companies;
                if (this.companyType === 'F') {
                    const filteredCompanyCollection = this.companyCollection.filter(company => company.companyType === 'F');
                    this.companyCollection = filteredCompanyCollection;
                } else {
                    const filteredCompanyCollection = this.companyCollection.filter(company => company.companyType === 'C');
                    this.companyCollection = filteredCompanyCollection;
                }
            });
        }
    }

    filterByCompanyType() {
        this.handleFetchCompanies(this.selectedCountry);
    }

    fetchAllCompanies() {
        this.companyService.getCompanies();
        this.companySub = this.companyService.getCompanyListener().subscribe((companyData) => {
            this.companyCollection = companyData.companies;
            if (this.companyType === 'F') {
                const filteredCompanyCollection = this.companyCollection.filter(company => company.companyType === 'F');
                this.companyCollection = filteredCompanyCollection;
            }
            else {
                const filteredCompanyCollection = this.companyCollection.filter(company => company.companyType === 'C');
                this.companyCollection = filteredCompanyCollection;
            }
        });
    }

    handleFetchAllies(country) {
        if (country === 'ALL') {
            this.allyService.getAllies();
            this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
                this.allyCollection = alliesData.allies;
            });
        } else {
            this.allyService.getAllyByCountry(country);
            this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
                this.allyCollection = alliesData.allies;
            });
        }
    }

    ngOnDestroy(): void {
        if (this.allySub || this.companySub || this.auditSub) {
            this.allySub.unsubscribe();
            this.companySub.unsubscribe();
            this.auditSub.unsubscribe();
        }
    }
}
