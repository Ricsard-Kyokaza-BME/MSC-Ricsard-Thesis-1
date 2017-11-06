import {Component, Inject, OnInit} from '@angular/core';
import {Category} from '../../models/category.model';
import {plainToClass} from 'class-transformer';
import {RestService} from '../rest/rest.service';
import {Offer} from '../../models/offer.model';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'sd-create-offer',
    templateUrl: './create-offer.component.html',
    styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

    categories: Category[];
    selectedCategories: Category[];
    offer: Offer;

    constructor(@Inject(Http) private _http: Http, private _restService: RestService, private _router: Router) {
        this.categories = [];
        this.selectedCategories = [];
        this.offer = new Offer();
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
            response => {
                this.categories = plainToClass(Category, response.data);
            });
    }

    save() {
        this.offer.categories = this.selectedCategories.map(item => {
            return item.id;
        });

        this.offer.create().then(
            response => {
                console.log(response);
                this._router.navigate(['/']);
            });
    }

    selectCategory(category: Category) {
        this.selectedCategories.push(category);
        this.categories.splice(this.categories.indexOf(category), 1);
    }

    removeCategory(category: Category) {
        this.categories.push(category);
        this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('files', file, file.name);
            const headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
            // headers.append('Content-Type', 'multipart/form-data');
            const options = new RequestOptions({headers: headers});
            this._http.post('https://balogotthon.ddns.net/file-server/', formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe(
                    data => console.log('success'),
                    error => console.log(error)
                );
        }
    }
}
