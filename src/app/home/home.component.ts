import {Component, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {RestService} from '../rest/rest.service';
import {plainToClass} from 'class-transformer';

@Component({
    selector: 'sd-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    categories: Category[];

    constructor(private _restService: RestService) {
        this.categories = [];
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
        response => {
            this.categories = plainToClass(Category, response.data);
        });
    }
}
