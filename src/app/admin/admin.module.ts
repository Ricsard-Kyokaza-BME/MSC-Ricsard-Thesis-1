import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CategoryManagerComponent} from './category-manager/category-manager.component';
import {RouterModule} from '@angular/router';
import {IsLoggedInGuard} from '../guards/is-logged-in.guard';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {path: 'category', component: CategoryManagerComponent, pathMatch: 'full', canActivate: [IsLoggedInGuard]},
        ])
    ],
    declarations: [CategoryManagerComponent]
})
export class AdminModule {
}
