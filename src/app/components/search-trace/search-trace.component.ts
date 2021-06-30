import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
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

export class SearchTraceComponent implements OnInit {
    constructor(
        private companyService: CompanyService,
        private allyService: AliadoService,
        private auditService: AuditService,
        private cd: ChangeDetectorRef
    ) { }

    @Output() searchParams: EventEmitter<SearchParams> = new EventEmitter<SearchParams>();
    /**
    * Filtros
    */
    private selectedCountry;
    private selectedAlly;
    private companyType;
    private selectedCompany;
    /**
    * Subscripciones
    */
    private allySub: Subscription;
    private companySub: Subscription;
    private auditSub: Subscription;
    /**
     * Colecciones
     */
    private allyCollection;
    private companyCollection;
    private tradersCollection;

    ngOnInit() {
    }

    submitSearch() {
        const params: SearchParams = { idAlly: this.selectedAlly, idCompany: this.selectedCompany }
        this.searchParams.emit(params)
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
                }
                else {
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
        }
        else {
            this.allyService.getAllyByCountry(country);
            this.allySub = this.allyService.getAllyListener().subscribe((alliesData) => {
                this.allyCollection = alliesData.allies;
            });
        }
    }
}