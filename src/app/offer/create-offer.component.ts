import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category.model';
import {plainToClass} from 'class-transformer';
import {RestService} from '../rest/rest.service';
import {Offer} from '../../models/offer.model';
import {Router} from '@angular/router';
import {FileServerService} from '../rest/file-server.service';
import {MapsAPILoader} from '@agm/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';

@Component({
    selector: 'sd-create-offer',
    templateUrl: './create-offer.component.html',
    styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

    categories: Category[];
    selectedCategories: Category[];
    offer: Offer;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    constructor(private _restService: RestService, private _fileServer: FileServerService, private _router: Router,
                private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
        this.categories = [];
        this.selectedCategories = [];
        this.offer = new Offer();
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
            response => {
                this.categories = plainToClass(Category, response.data);
            });

        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.offer.coordinates.push(place.geometry.location.lat());
                    this.offer.coordinates.push(place.geometry.location.lng());
                    this.offer.address = place.formatted_address;
                });
            });
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
        this._fileServer.uploadFiles(event.target.files)
            .subscribe(
                data => this.offer.images = data
            );
    }
}
