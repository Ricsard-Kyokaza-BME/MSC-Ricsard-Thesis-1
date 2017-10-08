import {NgModule, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        RouterModule.forChild([
            {path: '', component: LoginComponent, pathMatch: 'full'}
        ])
    ]
})
export class LoginModule {
}
