import {NgModule} from '@angular/core';
import {SignUpComponent} from './sign-up.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        RouterModule.forChild([
            {path: '', component: SignUpComponent, pathMatch: 'full'}
        ])
    ],
    declarations: [SignUpComponent]
})
export class SignUpModule {
}
