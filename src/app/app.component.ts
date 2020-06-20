import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.autoSignIn();

    this.route.fragment.subscribe((fragment: string) => {
      if (!!fragment && fragment.length) {
        // It is very odd - without a 0 setTimeout the element returns undefined?!
        setTimeout(() => {
          const element = window.document.querySelector(`#${fragment}`);
          if (element) {
            element.scrollIntoView();
          }
        }, 0);
      }
    })
  }
}
