import {Component, OnInit} from '@angular/core';
import {Category} from '../../../models/category.model';
import {RestService} from '../../rest/rest.service';
import {plainToClass} from 'class-transformer';

@Component({
    selector: 'sd-category-manager',
    templateUrl: './category-manager.component.html',
    styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {

    newCategory: Category;
    categories: Category[];

    constructor(private _restService: RestService) {
        this.newCategory = new Category();
        this.categories = [];
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(response => {
            this.categories = plainToClass(Category, response.data);
        });
    }

    save() {
        this.newCategory.create().then(response => {
            this.categories.push(<Category><any>plainToClass(Category, response));
            this.resetForm();
        });
    }

    resetForm() {
        this.newCategory = new Category();
    }

}
