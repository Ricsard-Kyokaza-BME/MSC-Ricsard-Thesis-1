import {Component, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {RestService} from '../rest/rest.service';
import {plainToClass} from 'class-transformer';
import {Offer} from '../../models/offer.model';
import {FileServerService} from "../rest/file-server.service";

export interface CategoryListItem {
    category: Category;
    isSelected: boolean;
}

@Component({
    selector: 'sd-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    categories: CategoryListItem[];
    offers: Offer[];
    fileServer: FileServerService;

    constructor(private _restService: RestService, fileServer: FileServerService) {
        this.categories = [];
        this.offers = [];
        this.fileServer = fileServer;

        this.categories.push({
            category: new Category('-1', 'All', 'No filter at all'),
            isSelected: true
        });
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
            response => {
                const downloadedCategories = plainToClass(Category, response.data);

                downloadedCategories.forEach(category => {
                    this.categories.push({
                        category: category,
                        isSelected: false
                    });
                });
            });

        Offer.find(this._restService, {query: {$limit: 100, $populate: 'categories'}}).then(
            response => {
                this.offers = plainToClass(Offer, response.data);
            });
    }

    toggleSelectCategory(categoryListItem: CategoryListItem) {
        if (categoryListItem.category.name !== 'All' && this.categories[0].isSelected) {
            this.categories[0].isSelected = false;
        }

        if (categoryListItem.category.name === 'All') {
            this.categories.forEach(localCategoryListItem => localCategoryListItem.isSelected = false);
            this.categories[0].isSelected = true;
        } else {
            categoryListItem.isSelected = !categoryListItem.isSelected;
        }
    }
}
