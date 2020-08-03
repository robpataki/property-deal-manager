import { Component, OnInit, ComponentFactoryResolver, ComponentRef, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { EstateAgentService } from '../estate-agent.service';
import { NOTE_TYPES } from 'src/app/shared/services/app-constants.service';
import { generateUID, getCurrentTimestamp } from 'src/app/shared/utils';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/shared/models/note.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { PropertyService } from 'src/app/properties/property.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { ConfirmActionModalComponent } from 'src/app/modals/confirm-action-modal/confirm-action-modal.component';
import { EstateAgent } from 'src/app/shared/models/estate-agent.model';

@Component({
  selector: 'app-comparable-edit',
  templateUrl: './estate-agent-edit.component.html'
})
export class EstateAgentEditComponent implements OnInit {
  id: string;
  propertyId: string;

  estateAgentsChangedSub: Subscription;
  propertyEstateAgentChangedSub: Subscription;

  @ViewChild(PlaceholderDirective, {static: false}) confirmModalHost: PlaceholderDirective;
  confirmationModalCancelSub: Subscription;
  confirmationModalConfirmSub: Subscription;
  actionConfirmModalComponentRef: ComponentRef<any>;

  estateAgent: EstateAgent;
  form: FormGroup;
  MAX_LINKS: number = 4;
  isLoading: boolean;
  editMode: boolean;
  deleteMode: boolean;

  backButtonLabel: string;
  backButtonUrl: string;

  constructor(private accountService: AccountService,
              private propertyService: PropertyService,
              private estateAgentService: EstateAgentService,
              private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.setUpBackButton();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null;
        this.estateAgent = this.estateAgentService.getEstateAgent(this.id);

        if (!this.estateAgent && this.editMode) {
          this.router.navigate(['/not-found']);
          return;
        }

        this.initForm();
      }
    );

    this.route.queryParams.subscribe(params => {
      this.propertyId = params['propertyId'];
      this.setUpBackButton();
    });

    this.estateAgentsChangedSub = this.estateAgentService.estateAgentsChanged.subscribe(estateAgents => {
      if (!this.deleteMode) {
        this.dataStorageService.storeEstateAgent(this.id).then(() => {
          this.router.navigateByUrl(`/estate-agents/${this.id}`);
        }, error => {
          console.error('There was an error when trying to save the estate agent - error message: ', error);
        });
      } else {
        console.log('[EstateAgentEditComponent] - estateAgentsChanged(deleteMode)');
        /* this.dataStorageService.deleteEstateAgent(this.id).then(() => {
          console.log('[EstateAgentEditComponent] - estateAgentsChanged(deleteMode) - Estate agent deleted from DB');
          if (this.estateAgent.properties.length) {
            this.propertyService.deleteEstateAgent(this.id);
          } else {
            this.router.navigate(['/estate-agents']);
          }
        }); */
      }
    });

    // Then add the comparable to the property itself
    /* this.propertyEstateAgentChangedSub = this.propertyService.propertiesChangedSub.subscribe(properties => {
      if (!this.deleteMode) {
        console.log('[EstateAgentEditComponent] - propertiesChangedSub() - Change detected.');
        this.dataStorageService.storeProperty(this.propertyId).then(() => {
          this.router.navigate(['/properties', this.propertyId], { fragment: 's-estate-agent' });
        }, (error) => {
          console.error('There was an error when trying to add the comparable to the property - error message: ', error);
        });
      } else {
        console.log('[EstateAgentEditComponent] - propertiesChangedSub(deleteMode) - Change detected.');
        this.dataStorageService.storeUpdatedPropertyComparables(this.estateAgent.properties).then(comparables => {
          console.log('[EstateAgentEditComponent] - DONE! - estate-agents: ', comparables);
          if (this.propertyId) {
            this.router.navigate(['/properties', this.propertyId], { fragment: 's-estate-agent' });
          } else {
            this.router.navigate(['/estate-agents']);
          }
        });
      }
    }); */
  }

  setUpBackButton(): void {
    if (!this.editMode) {
      if (!!this.propertyId) {
        this.backButtonLabel = 'Back to property card';
        this.backButtonUrl = `/properties/${this.propertyId}#s-estate-agent`;
      } else {
        this.backButtonLabel = 'Back to EA cards';
        this.backButtonUrl = `/estate-agents`;
      }
    } else {
      this.backButtonLabel = 'Back to EA card';
      this.backButtonUrl = `/estate-agents/${this.id}`;

      if (!!this.propertyId) {
        this.backButtonUrl += `?propertyId=${this.propertyId}`;
      }
    }
  }

  initForm(): void {
    let name: string;
    let branchName: string;
    let email: string;
    let phone: string;
    let thumbnailUrl: string = 'https://firebasestorage.googleapis.com/v0/b/property-deal-manager.appspot.com/o/static%2Fdefault-property-thumbnail.png?alt=media&token=9bc95394-f2d2-4e86-b85d-e7497288665e';

    let addressLine1: string;
    let addressLine2: string;
    let town: string;
    let postcode: string;

    let links: FormArray = new FormArray([]);

    if(this.editMode) {
      name  = this.estateAgent.name;
      branchName  = this.estateAgent.branchName;
      email  = this.estateAgent.email;
      phone  = this.estateAgent.phone;
      thumbnailUrl = this.estateAgent.thumbnailUrl;

      addressLine1 = this.estateAgent.addressLine1;
      addressLine2 = this.estateAgent.addressLine2;
      town = this.estateAgent.town;
      postcode = this.estateAgent.postcode;

      this.estateAgent.links.map((link) => {
        links.push(new FormControl(link, [Validators.required]))
      });
    }

    this.form = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      branchName: new FormControl(branchName, [Validators.required]),
      email: new FormControl(email),
      phone: new FormControl(phone, [Validators.required]),
      thumbnailUrl: new FormControl(thumbnailUrl),

      addressLine1: new FormControl(addressLine1, [Validators.required]),
      addressLine2: new FormControl(addressLine2),
      town: new FormControl(town),
      postcode: new FormControl(postcode, [Validators.required]),

      links: links
    });
  }

  getLinkControls() {
    return (this.form.get('links') as FormArray).controls;
  }

  onAddNewLink(): void {
    const links = <FormArray>this.form.get('links');
    if (links.length < this.MAX_LINKS) {
      links.push(new FormControl('', Validators.required));
    }
  }

  onRemoveLink(index: number): void {
    (<FormArray>this.form.get('links')).removeAt(index);
  }

  getUserName(): string {
    return this.accountService.getAccount().user.public_profile.displayName;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.id = this.id || generateUID('ea_');

    const estateAgent: EstateAgent = new EstateAgent(
      this.id,
      getCurrentTimestamp(),

      this.form.value.name,
      this.form.value.branchName,
      this.form.value.email,
      this.form.value.phone,
      this.form.value.thumbnailUrl,

      this.form.value.addressLine1,
      this.form.value.addressLine2,
      this.form.value.town,
      this.form.value.postcode,

      [],
      [],
      [new Note(
        'EA card created',
        getCurrentTimestamp(),
        NOTE_TYPES.NOT.key,
        this.getUserName()
      )],
      this.form.value.links
    );

    if (this.editMode) {
      this.estateAgentService.setEstateAgent(this.id, estateAgent);
    } else {
      this.estateAgentService.addEstateAgent(estateAgent);
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(this.backButtonUrl);
  }

  onDelete(): void {
    /* this.deleteMode = true;

    const message: string = 'delete this comparable';
    let additionalMessage: string = '';

    if (this.estateAgent.properties.length > 1) {
      additionalMessage = `This comparable is used by ${this.estateAgent.properties.length} properties. Deleting the comparable will automatically remove it from all ${this.estateAgent.properties.length} properties`;
    }

    console.log('[EstateAgentEditComponent] - onDelete(BEFORE) - ', this.id, this.estateAgentService.getComparables(), this.estateAgent.properties);
    this.showConfirmationModal(message, additionalMessage).then(() => {
      this.isLoading = true;
      this.estateAgentService.deleteComparable(this.id);
      console.log('[EstateAgentEditComponent] - onDelete(AFTER) - ', this.id, this.estateAgentService.getComparables(), this.estateAgent.properties);
    }, error => {}); */
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
    this.estateAgentsChangedSub.unsubscribe();
    // this.propertyEstateAgentChangedSub.unsubscribe();

    if (this.actionConfirmModalComponentRef) {
      this.actionConfirmModalComponentRef.destroy();
      this.confirmationModalConfirmSub.unsubscribe();
      this.confirmationModalCancelSub.unsubscribe();
    }
  }
}
