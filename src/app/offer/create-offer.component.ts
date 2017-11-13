import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category.model';
import {plainToClass} from 'class-transformer';
import {RestService} from '../rest/rest.service';
import {Offer} from '../../models/offer.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FileServerService} from '../rest/file-server.service';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../../models/user.model';

@Component({
    selector: 'sd-create-offer',
    templateUrl: './create-offer.component.html',
    styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

    private _offerId: string;
    private _routerIdSubscription: Subscription;

    categories: Category[];
    selectedCategories: Category[];
    offer: Offer;
    isEditing: boolean;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    constructor(private _restService: RestService, private _fileServer: FileServerService, private _router: Router,
                private _route: ActivatedRoute, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
        this._offerId = '';
        this.categories = [];
        this.selectedCategories = [];
        this.offer = new Offer();
        this.isEditing = false;
    }

    ngOnInit() {
        Category.find(this._restService, {query: {$limit: 100}}).then(
            response => {
                this.categories = plainToClass(Category, response.data);
            });

        this._routerIdSubscription = this._route.params.subscribe((params: Params) => {
            if (params.hasOwnProperty('id')) {
                this._offerId = params['id'];
                this.isEditing = true;
            }

            if (this.isEditing) {
                Offer.findById(this._restService, this._offerId, {query: {$populate: ['owner', 'categories']}})
                    .then(response => {
                        this.offer = <Offer><any>plainToClass(Offer, response);
                        this.offer.owner = plainToClass(User, this.offer.owner);
                        this.offer.categories = plainToClass(Category, this.offer.categories);

                        // Not safe, should wait for Category.find to finish
                        this.offer.categories.forEach(category => {
                            this.categories.forEach(localCategory => {
                                if (localCategory.id === category.id) {
                                    this.selectCategory(localCategory);
                                }
                            });
                        });
                    });
            }
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

        if (!this.isEditing) {
            this.offer.create().then(
                response => {
                    console.log(response);
                    this._router.navigate(['/']);
                });
        } else {
            this.offer.patch().then(
                response => {
                    console.log(response);
                    this._router.navigate(['/']);
                });
        }
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
