import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UserDetailsComponent} from './user-details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {path: ':id', component: UserDetailsComponent, pathMatch: 'full'}
        ])
    ],
    declarations: [UserDetailsComponent]
})
export class UserModule {
}
