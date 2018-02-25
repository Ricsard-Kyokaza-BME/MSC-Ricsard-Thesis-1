import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Offer} from '../../models/offer.model';
import {FileServerService} from '../rest/file-server.service';
import {AuthenticationService} from '../rest/authentication.service';
import {Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'sd-offer-list-item',
    templateUrl: './offer-list-item.component.html',
    styleUrls: ['./offer-list-item.component.scss']
})
export class OfferListItemComponent implements AfterViewInit {

    @Input('offer')
    offer: Offer;
    fileServer: FileServerService;

    constructor(fileServer: FileServerService, private _authService: AuthenticationService, private _router: Router) {
        this.fileServer = fileServer;
    }

    ngAfterViewInit(): void {
        this.itemHighlightAnimation();
    }

    // Source: https://codepen.io/Zejho/pen/pjMjqW
    itemHighlightAnimation() {

        $('.item-layers-container').each(function () {
            const $offerBgImage = $(this).find('.offer-bg-image');
            const $priceBgImage = $(this).find('.price-bg');

            $offerBgImage.css({
                'background-image': 'url(' + $offerBgImage.attr('data-bg') + ')'
            });

            $priceBgImage.css({
                'background-image': 'url(' + $offerBgImage.attr('data-bg') + ')'
            });
        });

        // GENERAL VALUE FUNCTION
        function getValue(pos, mid, max) {
            return ((mid - pos) / mid) * max;
        }

        // LAYER FUNCTION
        function getLayerFactor(layer) {

            // if (layer == 0) {
            //     return 0;
            // }

            return .15 * (1 - Math.pow(.85, Math.abs(layer)));
        }

        $('.item').on('mouseenter touchstart', function (e) {


            e.preventDefault();

            const $item = $(this),
                $layers = $item.find('.item-layers'),
                $fixTitle = $item.next('.item-fix-title');

            $item.addClass('active');
            $fixTitle.fadeOut(50);

            // Add highlight
            if (!($layers.find('.item-highlight').length > 0)) {
                $layers.append('<div class="item-highlight"></div>');
            }

            // ITEM MOUSE MOVE
        }).on('touchmove mousemove', function (e) {

            e.preventDefault();

            const $layers = $(this).find('.item-layers'),
                xPos = e.pageX - $layers.offset().left,
                yPos = e.pageY - $layers.offset().top,
                itemCenterX = $layers.width() / 2,
                itemCenterY = $layers.height() / 2,
                maxRotate = 5,
                maxTranslate = 5,
                transitionDuration = 0;

            // Update layers rotation, position and shadow
            $layers.css({
                'transform': 'translate3d(' + -1 * (getValue(xPos, itemCenterX, maxTranslate)) + 'px, '
                + -1 * (getValue(yPos, itemCenterY, maxTranslate)) + 'px, 0) rotateX(' + -1 * getValue(yPos, itemCenterY, maxRotate)
                + 'deg) rotateY(' + getValue(xPos, itemCenterX, maxRotate) + 'deg)',
                'box-shadow': -.5 * getValue(xPos, itemCenterX, 24) + 'px ' + (48 + (-.5 * getValue(yPos, itemCenterY, 24)))
                + 'px 48px rgba(0, 0, 0, .33)',
                'transition-duration': transitionDuration + 'ms',
            });

            // Highlighting update
            const xPercentage = (xPos / (itemCenterX * 2)) * 100,
                yPercentage = (yPos / (itemCenterY * 2)) * 100;

            $layers.find('.item-highlight').css({
                'background': 'radial-gradient(' + (2 * Math.max(itemCenterX * 2, itemCenterY * 2)) + 'px at '
                + xPercentage + '% ' + yPercentage + '%, rgba(255,255,255, .25), transparent)'
            });

            // Layer stack update
            $layers.find('.price-inner-holder').each(function (i) {

                const layer = $(this).data('layer') ? parseInt($(this).data('layer')) : i + 1,
                    factor = getLayerFactor(layer);

                $(this).css({
                    'transform': 'translate3d(' + factor * (getValue(xPos, itemCenterX, itemCenterX)) + 'px, '
                    + factor * (getValue(yPos, itemCenterY, itemCenterY)) + 'px, 0)',
                    'transition-duration': transitionDuration + 'ms',
                });
            });

            // ITEM LEAVE (RESET)
        }).on('mouseleave touchend touchcancel', function () {
            const $item = $(this),
                $layers = $item.find('.item-layers'),
                $fixTitle = $item.next('.item-fix-title');

            $item.removeClass('active');
            $fixTitle.fadeIn(180);

            $layers.css({
                'transform': '',
                'box-shadow': '',
                'transition-duration': ''
            });

            $layers.find('.price-inner-holder').css({
                'transform': '',
                'transition-duration': ''
            });
        });
    };
}
