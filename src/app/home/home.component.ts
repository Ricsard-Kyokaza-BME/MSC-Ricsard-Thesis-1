import {Component, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {RestService} from '../rest/rest.service';
import {plainToClass} from 'class-transformer';
import {Offer} from '../../models/offer.model';

@Component({
    selector: 'sd-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    categories: Category[];
    offers: Offer[];

    constructor(private _restService: RestService) {
        this.categories = [];
        this.offers = [];
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
            response => {
                this.categories = plainToClass(Category, response.data);
            });

        Offer.find(this._restService, {query: {$limit: 100, $populate: 'categories' }}).then(
            response => {
                this.offers = plainToClass(Offer, response.data);
            });
    }
}
