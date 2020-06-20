import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Comparable } from 'src/app/shared/models/comparable.model';
import { ComparableService } from '../comparable.service';
import { arrayToArrayTable, sortArrayByKey } from  '../../shared/utils';

@Component({
  selector: 'app-comparable-list',
  templateUrl: './comparable-list.component.html'
})
export class ComparableListComponent implements OnInit, OnDestroy {
  comparables: Comparable[] = [];
  sortedComparables: Comparable[] = [];
  comparablesChangedSub: Subscription;

  constructor(private comparableService: ComparableService) { }

  ngOnInit(): void {
    this.initComparables(this.comparableService.getComparables());

    this.comparablesChangedSub = this.comparableService.comparablesChanged.subscribe((properties: Comparable[]) => {
      this.initComparables(properties);
    });
  }

  initComparables(comparables: Comparable[]): void {
    this.comparables = comparables;
    this.sortedComparables = sortArrayByKey('timestamp', this.comparables).reverse();
  }

  ngOnDestroy(): void {
    this.comparablesChangedSub.unsubscribe();
  }

}
