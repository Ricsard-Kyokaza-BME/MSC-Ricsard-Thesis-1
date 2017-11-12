import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../rest/authentication.service';

@Injectable()
export class IsLoggedInGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) {
    }

    canActivate() {
        if (!this.authService.isLoggedInEvent.getValue()) {
            this.router.navigate(['/']);
            return false;
        }

        return this.authService.isLoggedInEvent;
    }
}