import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CRUNCH_DEFAULTS } from 'src/app/shared/services/app-constants.service';
import { calculateStampDuty } from 'src/app/shared/utils';
import { Property } from 'src/app/shared/models/property.model';

@Component({
  selector: 'app-property-btl-crunch',
  templateUrl: './property-btl-crunch.component.html'
})
export class PropertyBTLCrunchComponent implements OnInit {
  @Input('property') property: Property;
  crunchForm: FormGroup;
  yield: number = 0;
  cashflow: number = 0;
  monthlyHoldingCost: number = 0;
  selectedOfferIndex: number = 0; // Select MIMO offer by default
  offers: any[] = [];
  selectedMaxOffer: number;
  numberOfVoidMonths: number;
  costOfTheDeal: number;
  totalCostOfTheDeal: number;

  ngOnInit(): void {
    this.initForm();
    this.calculate();
  }

  initForm(): void {    
    const crunch: any = this.property.crunch;

    // Backend
    let duv: number = 0;

    // Cashflow
    let rent: number = 450;
    let mir: number = 3.5;
    let mip: number = 0;
    let moe: number = 0;
    let man: number = 0;
    let ltv: number = CRUNCH_DEFAULTS.BTL.LTV;
    let ins: number = CRUNCH_DEFAULTS.BTL.INSURANCE;
    
    // Cost of deal
    let cob: number = 0;
    let ref: number = 0;
    let srv: number = CRUNCH_DEFAULTS.BTL.SURVEY;
    let sol: number = CRUNCH_DEFAULTS.BTL.SOLICITOR;
    let bro: number = CRUNCH_DEFAULTS.BTL.BROKER;
    let src: number = 0;
    let pm: number = 0;
    let auc: number = 0;

    // Holding cost
    let mcob: number = 0;
    let nrg: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.ENERGY;
    let wat: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.WATER;
    let ct: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.COUNCIL_TAX;
    let grent: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.GROUND_RENT;
    let serv: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.SERVICE_CHARGE;
    let numberOfVoidMonths: number = CRUNCH_DEFAULTS.BTL.HOLDING_COST.TIMES;

    if (!!crunch.BTL) {
      // Backend
      duv = crunch.BTL.be.duv;

      // Cashflow
      rent = crunch.BTL.cf.rent;
      mir = +(crunch.BTL.cf.mir * 100).toFixed(2);
      mip = crunch.BTL.cf.mip;
      moe = crunch.BTL.cf.moe;
      man = crunch.BTL.cf.man;
      ltv = +(crunch.BTL.cf.ltv * 100).toFixed(2);
      ins = crunch.BTL.cf.ins;

      // Cost of deal
      cob = crunch.BTL.cost.cob;
      ref = crunch.BTL.cost.ref;
      srv = crunch.BTL.cost.srv;
      sol = crunch.BTL.cost.sol;
      bro = crunch.BTL.cost.bro;
      src = crunch.BTL.cost.src;
      pm = crunch.BTL.cost.pm;
      auc = crunch.BTL.cost.auc;

      // Holding cost
      mcob = crunch.BTL.hcost.mcob;
      nrg = crunch.BTL.hcost.nrg;
      wat = crunch.BTL.hcost.wat;
      ct = crunch.BTL.hcost.ct;
      grent = crunch.BTL.hcost.grent;
      serv = crunch.BTL.hcost.serv;
      numberOfVoidMonths = crunch.BTL.hcost.voids;

      // Restore the selected offer index
      this.selectedOfferIndex = +crunch.BTL.calc.soi;
    }

    this.crunchForm = new FormGroup({
      ltv: new FormControl(ltv, [Validators.required]),
     
      // Cashflow
      rent: new FormControl(rent, [Validators.required]),
      mip: new FormControl({ value: mip, disabled: true }, [Validators.required]),
      mir: new FormControl(mir, [Validators.required]),
      moe: new FormControl(moe, [Validators.required]),
      man: new FormControl(man, [Validators.required]),
      ins: new FormControl(ins, [Validators.required]),

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
      insDup: new FormControl({ value: ins, disabled: true }, [Validators.required]),
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
    this.calculateCashflow();
    this.calculateHoldingCost();
    this.calculateOffers();
    this.calculateYield();

    this.onSelectOffer(this.selectedOfferIndex);
  }

  getBasicCostSum(): number {
    const cob = +this.getControl('cob').value;
    const ref = +this.getControl('ref').value;
    const src = +this.getControl('src').value;
    const pm = +this.getControl('pm').value;
    const srv = +this.getControl('srv').value;
    const auc = +this.getControl('auc').value;
    const sol = +this.getControl('sol').value;
    const bro = +this.getControl('bro').value;

    return ref + src + pm + srv + auc + sol + bro + cob;
  }

  getTotalHoldingCost(): number {
    return this.numberOfVoidMonths * this.monthlyHoldingCost;
  }

  calculateCostOfTheDeal(): void {
    const totalHoldingCost: number = this.getTotalHoldingCost();
    const costOfTheDeal: number = this.getBasicCostSum();
    const selectedOffer = this.offers[this.selectedOfferIndex];
    this.costOfTheDeal = costOfTheDeal + selectedOffer.std;
    this.totalCostOfTheDeal = selectedOffer.price + costOfTheDeal + totalHoldingCost;
  }

  calculateOffers(): void {
    const totalHoldingCost: number = this.getTotalHoldingCost();
    const costOfTheDeal: number = this.getBasicCostSum();
    const duv = +this.getControl('duv').value;
    const ltv = +this.getControl('ltv').value;
    
    // Calculate the MIMO offer first
    const mimoOffer:number = duv * ltv / 100 - costOfTheDeal - totalHoldingCost;
    const std: number = calculateStampDuty(mimoOffer);
    this.offers = [{
      price: mimoOffer,
      roi: '∞',
      mli: 0,
      std: std
    }];

    // Calculate the rest of the offers based on ROI
    const percentages: number[] = [1, 0.75, 0.6667, 0.5, 0.33333, 0.25, 0.2];
    percentages.map((percentage, index) => {
      const months: number = 12 / percentage;
      const years: number = +(months / 12).toFixed(2);
      this.offers.push({
        price: mimoOffer + this.cashflow * months,
        roi: `${(percentage * 100).toFixed(0)}% (${years} years)`,
        mli: this.cashflow * months,
        std: calculateStampDuty(mimoOffer + this.cashflow * months)
      })
    });

    this.calculateCostOfTheDeal();
  }

  calculateCashflow(): void {
    const duv = +this.getControl('duv').value;
    const ltv = +this.getControl('ltv').value;

    const rent = +this.getControl('rent').value;
    const ins = +this.getControl('ins').value;
    const moe = +this.getControl('moe').value;
    const man = +this.getControl('man').value;
    const mir = +this.getControl('mir').value;

    const monthlyMIP: number = duv * ltv / 100 * mir / 100 / 12;
    this.getControl('mip').setValue(monthlyMIP.toFixed(2));

    this.cashflow = rent - (monthlyMIP) - man - moe - ins;
  }

  calculateHoldingCost(): void {
    this.getControl('insDup').setValue(this.getControl('ins').value);

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

  calculateYield(): void {
    const duv = +this.getControl('duv').value;
    const rent = +this.getControl('rent').value;

    this.yield = +(rent * 12 / duv  * 100).toFixed(2);
  }

  onSelectOffer(index: number): void {
    this.selectedOfferIndex = index;
    console.log('[BTLCrunch] - onSelectOffer - index: ', index);
    this.selectedMaxOffer = this.offers[index].price - this.offers[index].std;

    this.calculateCostOfTheDeal();
  }

  getControl(controlName: string) : AbstractControl {
    return this.crunchForm.controls[controlName];
  }

  getCrunchData(): {} {
    return {
      BTL: {
        be: {
          duv: this.getControl('duv').value
        },
        calc: {
          soi: +this.selectedOfferIndex,
          duv: +this.getControl('duv').value,
          rent: +this.getControl('rent').value,
          cf: this.cashflow,
          ref: +this.getControl('ref').value,
          mop: +this.selectedMaxOffer,
          roi: this.offers[this.selectedOfferIndex].roi,
			    yld: +(this.yield/100).toFixed(4)
        },
        cf: {
          rent: +this.getControl('rent').value,
          ltv: +(this.getControl('ltv').value / 100).toFixed(2),
          mir: +(this.getControl('mir').value / 100).toFixed(4),
          mip: +this.getControl('mip').value,
          ins: +this.getControl('ins').value,
          man: +this.getControl('man').value,
          moe: +this.getControl('moe').value
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
          mcob: +this.getControl('mcob').value,
          voids: +this.getControl('voids').value
        }
      }
    }
  }
}