import { OnInit, Input, Component } from '@angular/core';
import { Property } from 'src/app/shared/models/property.model';
import { CRUNCH_DEFAULTS } from 'src/app/shared/services/app-constants.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { calculateStampDuty } from 'src/app/shared/utils';

export interface FlipOffer {
  price: number;
  std: number;
}

@Component({
  selector: 'app-property-flip-crunch',
  templateUrl: './property-flip-crunch.component.html'
})
export class PropertyFlipCrunchComponent implements OnInit {
  @Input('property') property: Property;
  crunchForm: FormGroup;
  selectedOffer: FlipOffer;
  selectedMaxOffer: number;
  numberOfVoidMonths: number;
  monthlyHoldingCost: number;
  costOfTheDeal: number;
  totalCostOfTheDeal: number;
  DUV_RATE: number = 0.9;

  ngOnInit(): void {
    this.initForm();
    this.calculate();
  }

  initForm(): void {
    // Back end
    let prof: number = 20000;
    let duv: number = 0;

    // Cost of deal
    let cob: number = 0;
    let ref: number = 0;
    let srv: number = CRUNCH_DEFAULTS.FLP.SURVEY;
    let sol: number = CRUNCH_DEFAULTS.FLP.SOLICITOR;
    let bro: number = CRUNCH_DEFAULTS.FLP.BROKER;
    let src: number = 0;
    let pm: number = 0;
    let auc: number = 0;
    let ins: number = CRUNCH_DEFAULTS.BTL.INSURANCE;

    // Holding cost
    let mcob: number = 0;
    let nrg: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.ENERGY;
    let wat: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.WATER;
    let ct: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.COUNCIL_TAX;
    let grent: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.GROUND_RENT;
    let serv: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.SERVICE_CHARGE;
    let numberOfVoidMonths: number = CRUNCH_DEFAULTS.FLP.HOLDING_COST.TIMES;


    if (!!this.property.crunch.FLP) {
      // Back end
      duv = this.property.crunch.FLP.be.duv;
      prof = this.property.crunch.FLP.be.prof;

      // Cost of deal
      ref = this.property.crunch.FLP.cost.ref;
      src = this.property.crunch.FLP.cost.src;
      pm = this.property.crunch.FLP.cost.pm;
      cob = this.property.crunch.FLP.cost.cob;
      srv = this.property.crunch.FLP.cost.srv;
      auc = this.property.crunch.FLP.cost.auc;
      sol = this.property.crunch.FLP.cost.sol;
      bro = this.property.crunch.FLP.cost.bro;

      // Holding cost
      ct = this.property.crunch.FLP.hcost.ct;
      nrg = this.property.crunch.FLP.hcost.nrg;
      wat = this.property.crunch.FLP.hcost.wat;
      grent = this.property.crunch.FLP.hcost.grent;
      serv = this.property.crunch.FLP.hcost.serv;
      ins = this.property.crunch.FLP.hcost.ins;
      cob = this.property.crunch.FLP.hcost.cob;
      numberOfVoidMonths = this.property.crunch.FLP.hcost.voids;
    }

    this.crunchForm = new FormGroup({     
      prof: new FormControl(prof, [Validators.required]),
      
      // Cost of deal
      duv: new FormControl(duv, [Validators.required]),
      cob: new FormControl(cob, [Validators.required]),
      ref: new FormControl(ref, [Validators.required]),
      srv: new FormControl(srv, [Validators.required]),
      sol: new FormControl(sol, [Validators.required]),
      bro: new FormControl(bro, [Validators.required]),
      src: new FormControl(src, [Validators.required]),
      pm: new FormControl(pm, [Validators.required]),
      auc: new FormControl(auc, [Validators.required]),

      // Holding cost
      mcob: new FormControl(mcob, [Validators.required]),
      nrg: new FormControl(nrg, [Validators.required]),
      wat: new FormControl(wat, [Validators.required]),
      ct: new FormControl(ct, [Validators.required]),
      grent: new FormControl(grent, [Validators.required]),
      serv: new FormControl(serv, [Validators.required]),
      ins: new FormControl(ins, [Validators.required]),
      voids: new FormControl(numberOfVoidMonths, [Validators.required])
    });
  }

  onChange($event): void {
    this.calculate();
  }

  onInput($event): void {
    this.calculate();
  }

  calculate(): void {
    this.calculateHoldingCost();
    this.calculateOffer();
  }

  calculateOffer(): void {
    const totalHoldingCost: number = this.numberOfVoidMonths * this.monthlyHoldingCost;

    const duv = +this.getControl('duv').value;
    const prof = +this.getControl('prof').value;
    const cob = +this.getControl('cob').value;
    const ref = +this.getControl('ref').value;
    const src = +this.getControl('src').value;
    const pm = +this.getControl('pm').value;
    const srv = +this.getControl('srv').value;
    const auc = +this.getControl('auc').value;
    const sol = +this.getControl('sol').value;
    const bro = +this.getControl('bro').value;
    
    const costOfTheDeal: number = ref + src + pm + srv + auc + sol + bro + cob;

    const offer:number = duv * this.DUV_RATE - costOfTheDeal - prof - totalHoldingCost;
    const std: number = calculateStampDuty(offer);

    this.selectedOffer = {
      price: offer,
      std: std
    };
    this.selectedMaxOffer = offer - std;
    this.costOfTheDeal = costOfTheDeal + std;
    this.totalCostOfTheDeal = offer + costOfTheDeal + totalHoldingCost;
  }

  calculateHoldingCost(): void {
    const mcob = +this.getControl('mcob').value;
    const nrg = +this.getControl('nrg').value;
    const wat = +this.getControl('wat').value;
    const ct = +this.getControl('ct').value;
    const grent = +this.getControl('grent').value;
    const serv = +this.getControl('serv').value;
    const ins = +this.getControl('ins').value;

    this.numberOfVoidMonths = +this.getControl('voids').value;
    this.monthlyHoldingCost = mcob + nrg + wat + ct + grent + serv + ins;
  }

  getControl(controlName: string) : AbstractControl {
    return this.crunchForm.controls[controlName];
  }

  getCrunchData(): {} {
    return {
      FLP: {
        be: {
          duv: +this.getControl('duv').value,
          prof: +this.getControl('prof').value
        },
        calc: {
			    duv: +this.getControl('duv').value,
			    prof: +this.getControl('prof').value,
          ref: +this.getControl('ref').value,
          mop: +this.selectedMaxOffer
        },
        cost: {
          ref: +this.getControl('ref').value,
          src: +this.getControl('src').value,
          pm: +this.getControl('pm').value,
          cob: +this.getControl('cob').value,
          srv: +this.getControl('srv').value,
          auc: +this.getControl('auc').value,
          sol: +this.getControl('sol').value,
          bro: +this.getControl('bro').value
        },
        hcost: {
          ct: +this.getControl('ct').value,
          nrg: +this.getControl('nrg').value,
          wat: +this.getControl('wat').value,
          grent: +this.getControl('grent').value,
          serv: +this.getControl('serv').value,
          ins: +this.getControl('ins').value,
          cob: +this.getControl('mcob').value,
          voids: +this.getControl('voids').value
        }
      }
    }
  }
}