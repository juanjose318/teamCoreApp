import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-second-step-table',
    templateUrl: 'table-second-step.component.html',
    styleUrls: ['./table-second-step.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SecondStepTableComponent implements OnInit, OnChanges {

    @Input() registry;
    @Input() tableNumber;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() objTradersToConfig: EventEmitter<any> = new EventEmitter();

    private companyAllyConfigSub: Subscription;

    tradersTableCollection = [];
    tradersForConfig = [];
    tradersCollection = [];

    displayedColumns: String[] = ['selectField', 'company.idCompany', 'company.companyCode', 'companyName'];

    objTraders = [];

    objSecondStep;

    dataSource: MatTableDataSource<any>;

    constructor(
        private companyConfigService: ConfigService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnChanges(changes: SimpleChanges) {
            let change = changes['registry'];
            if (change.currentValue !== null) {
                if (!!change.currentValue.idAlliedCompanyConfig) {
                    this.fetchCurrentConfig(change.currentValue.idAlliedCompanyConfig);
                    this.fetchAllTraders();
                    this.tradersTableCollection = this.tradersForConfig.concat(this.tradersCollection);
                    this.updateDatable(this.tradersTableCollection);
                }
            }
    }

    ngOnInit() {
        this.companyConfigService.getTraders();
        this.companyAllyConfigSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
            this.updateDatable(this.tradersCollection);
        });
        this.cd.markForCheck();
    }

    fetchCurrentConfig(idConfig) {
        this.companyConfigService.getTradersByConfigId(idConfig);
        this.companyAllyConfigSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersForConfig = data.traders;
        });
        this.cd.markForCheck();
    }

    fetchAllTraders() {
        this.companyConfigService.getTraders();
        this.companyAllyConfigSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
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
        console.log(this.objTraders);
        this.objTradersToConfig.emit(this.objTraders);
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}