import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html'
})
export class BackButtonComponent implements OnInit {
  @Input() label: string = 'Back';
  @Input() url: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {}

  onClick($event): void {    
    $event.preventDefault();
    $event.stopPropagation();
    
    if (!this.url) {
      window.history.go(-1);
    } else {
      this.router.navigateByUrl(this.url);
    }
  }
}
