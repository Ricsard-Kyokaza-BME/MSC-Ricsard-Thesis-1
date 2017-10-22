import {NgModule, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        FormsModule,
        RouterModule.forChild([
            {path: '', component: LoginComponent, pathMatch: 'full'}
        ])
    ]
})
export class LoginModule {
}
