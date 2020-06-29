# MyPropertyDb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploy

### First time setup

Run `firebase init` to set up the deployment configuration for Firebase hosting. Then `firebase deploy` to deploy (don't forget to build the app for production first).

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---

## Firebase config

The Firebase settings should set in both the `src/environments/environment.ts` and `src/environments/environment.prod.ts` files - alongside with other project specific configuration. For security reasons these files aren't under version control, but there are 2 sample files for both prod and dev environments showing what the files shouls look like with real data.

## Realtime database notes

### Property Number Crunch

#### DRY value names

These are the keysused in the crunch data structure to identify the relevant values. The data structure is as DRY as possible, so keys are reused in the different nodes.

|Key|Value|
|---|---|
|strg|Strategy|
|---|---|
|be|Back end|
|prof|Profit|
|duv|Done up value|
|---|---|
|cf|Cashflow|
|rent|Rent|
|ltv|Loan to value|
|mir|Mortgage interest rate|
|mip|Mortgage interest payment|
|ins|insurance|
|man|Management|
|moe|Monthly Operating Expenses|
|---|---|
|cost|Cost of the deal|
|ref|Refurb|
|src|Sourcing|
|pm|Project management|
|cob|Cost of borrowing|
|srv|Survey|
|auc|Auction|
|sol|Solicitor|
|bro|Broker|
|---|---|
|hcost|Holding cost|
|ct|Council tax|
|nrg|Energy|
|wat|Water|
|grent|Ground rent|
|serv|Service charge|
|voids|Void period (number of months)|
|---|---|
|calc|Calculations|
|soi|Selected offer index|
|mop|Maximum offer (price)|
|roi|Return on investment|
|yld|Rental yield|
|sof|Selected offer|
|sofi|Selected offer index|
|prc|Price|
|std|Stamp duty|

#### Crunch data structure

	property
	  ...
	  crunch
	    strg
	    BTL
	      be
	        duv
		   cf
		     rent
		     ltv
		     mir
		     mip
		     ins
		     man
		     moe
		   cost
		     ref
		     src
		     pm
		     cob
		     srv
		     auc
		     sol
		     bro
		   hcost
			  ct
			  nrg
			  wat
			  grent
			  serv
			  bcost
			  voids
			calc
			  mop
			  duv
			  rent
			  ref
			  yld
		FLP
		  be
		    prof
		    duv
		  cost
		     ref
		     src
		     pm
		     cob
		     srv
		     auc
		     sol
		     bro
		   hcost
			  ct
			  nrg
			  wat
			  grent
			  serv
			  bcost
			  voids
			calc
			  mop
			  ref
			  duv
			  prof
		  
