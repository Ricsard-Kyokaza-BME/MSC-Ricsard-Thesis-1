import {Pipe, PipeTransform} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {CategoryListItem} from '../home/home.component';
import {Category} from '../../models/category.model';

@Pipe({
    name: 'categoryFilter',
    pure: false
})
export class CategoryFilterPipe implements PipeTransform {
    transform(offers: Offer[], categoryListItems: CategoryListItem[]): any {
        if (!offers || !categoryListItems) {
            return offers;
        }

        let isAllCategorySelected = false;
        categoryListItems.forEach(categoryListItem => {
            if (categoryListItem.category.name === 'All' && categoryListItem.isSelected) {
                isAllCategorySelected = true;
            }
        });

        if (isAllCategorySelected) {
            return offers;
        }

        return offers.filter(offer => {
            for (let i = 0; i < categoryListItems.length; i++) {
                if (categoryListItems[i].isSelected) {
                    for (let j = 0; j < offer.categories.length; j++) {
                        if (categoryListItems[i].category.id === (<Category>(offer.categories[j]))['_id']) {
                            return true;
                        }
                    }
                }
            }

            return false;
        });


    }
}
