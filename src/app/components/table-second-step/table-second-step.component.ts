import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-second-step-table',
    templateUrl: 'table-second-step.component.html',
    styleUrls: ['./table-second-step.component.scss'],
})

export class SecondStepTableComponent implements OnInit, OnChanges {

    @Input() registry;
    @Input() tableNumber;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() objTradersToConfig: EventEmitter<any> = new EventEmitter();

    private companyAllyConfigSub: Subscription;
    private traderSub: Subscription;

    tradersTableCollection = [];
    tradersForConfig = [];
    tradersCollection = [];

    displayedColumns: String[] = ['selectField', 'company.companyCode', 'companyName'];

    objTraders = [];

    objSecondStep;

    companyCode;
    configId;

    dataSource: MatTableDataSource<any>;

    constructor(
        private companyConfigService: ConfigService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        let change = changes['registry'];
        if (!!change) {
            if (!!change.currentValue) {
                if (!!change.currentValue.idAlliedCompanyConfig) {
                    this.configId = change.currentValue.idAlliedCompanyConfig;
                    this.companyCode = change.currentValue.company.companyCode;
                    this.fetchTradersWithConfig(this.configId, this.companyCode);
                } else if (!change.currentValue.idAlliedCompanyConfig) {
                    this.fetchTradersWithoutConfig(change.currentValue.company.companyCode);
                }
            }
        }
    }

    ngOnInit() {
        this.updateDatable(this.tradersCollection);
    }

    fetchTradersWithoutConfig(companyCode) {
        this.companyConfigService.getTradersFirstTime(companyCode);
        this.traderSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
            setTimeout(() => this.updateDatable(this.tradersCollection), 1000)
        });
    }

    fetchTradersWithConfig(companyCode, configId) {
        this.companyConfigService.getTradersSecondtTme(companyCode, configId);
        this.traderSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
            setTimeout(() => this.updateDatable(this.tradersCollection), 1000)
        });
    }

    handleCheck(event: MatCheckboxChange, trader) {
        if (event.checked) {
            this.objTraders.push(trader);
        }
        else {
            this.objTraders.forEach(registryInCollection => {
                this.objTraders.splice(registryInCollection, 1)
            });
        }
        this.objTradersToConfig.emit(this.objTraders);
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.companyAllyConfigSub.unsubscribe();
        this.traderSub.unsubscribe();
    }

}