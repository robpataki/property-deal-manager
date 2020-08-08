import { OnInit, Component, Input, ComponentFactoryResolver, ViewChild, ComponentRef, Output, EventEmitter, OnDestroy } from '@angular/core';

import { PROPERTY_TYPES } from 'src/app/shared/services/app-constants.service';
import { Comparable } from 'src/app/shared/models/comparable.model';
import { sortArrayByKey } from '../../../shared/utils';
import { ComparableService } from 'src/app/comparables/comparable.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { Subscription } from 'rxjs';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';
import { PropertyService } from '../../property.service';

@Component({
  selector: 'app-property-comparables-summary',
  templateUrl: './property-comparables-summary.component.html'
})
export class PropertyComparablesSummaryComponent implements OnInit, OnDestroy {
  @Input() propertyId: string;
  @Input() interactiveMode: boolean = false;
  @Output() removeComparable: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

  propertyTypes: any = PROPERTY_TYPES;
  comparables: Comparable[];
  sortedComparables: Comparable[];

  propertiesChangedSub: Subscription;

  constructor(private comparableService: ComparableService,
              private propertyService: PropertyService,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.initComparables();

    this.propertiesChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      this.initComparables();
    });
  }

  initComparables(): void {
    this.comparables = this.comparableService.getComparablesOfProperty(this.propertyId);
    this.sortedComparables = sortArrayByKey('soldTimestamp', this.comparables).reverse();
  }

  onRemoveComparable(index: number): void {
    const comparableId = this.comparables[index].uid;
    const message: string = 'remove this comparable from this property';
    const additionalMessage: string = 'Please note this won\'t delete the comparable, nor will it remove it from other properties';
    this.showConfirmationModal(message, additionalMessage).then(() => {
      this.removeComparable.emit(comparableId);
    }, error => {});
  }

  showConfirmationModal(message: string, additionalMessage?: string): Promise<void> {
    const confirmModalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmActionModalComponent);
    const hostViewContainerRef = this.confirmModalHost.viewContainerRef;
    hostViewContainerRef.clear();

    this.actionConfirmModalComponentRef = hostViewContainerRef.createComponent(confirmModalComponentFactory);
    this.actionConfirmModalComponentRef.instance.message = message;
    if (additionalMessage) {
      this.actionConfirmModalComponentRef.instance.additionalMessage = additionalMessage;
    }
    this.actionConfirmModalComponentRef.instance.show();

    return new Promise((resolve, reject) => {
      this.confirmationModalConfirmSub = this.actionConfirmModalComponentRef.instance.confirm.subscribe(() => {
        this.confirmationModalConfirmSub.unsubscribe();
        hostViewContainerRef.clear();
        resolve();
      });
      this.confirmationModalCancelSub = this.actionConfirmModalComponentRef.instance.cancel.subscribe(() => {
        this.confirmationModalCancelSub.unsubscribe();
        hostViewContainerRef.clear();
        reject();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.actionConfirmModalComponentRef) {
      this.actionConfirmModalComponentRef.destroy();
      this.confirmationModalConfirmSub.unsubscribe();
      this.confirmationModalCancelSub.unsubscribe();
    }
  }
}
