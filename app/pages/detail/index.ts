import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { Page, IController } from '../Page';
import * as stateMan from '../../directives/state';
import { RemoteService } from "../../common/remote";
import { SessionService } from '../../common/session';
import { RouteControl } from '../../common/routeControl';


declare let require; // 为webpack的require语法所做的特殊声明
let styles = require('./style.styl');
let template = require('./template.html');

export interface IDetailControllerScope extends angular.IScope {
}

export class DetailController implements IController {
    static $inject = [
        '$scope',
        '$state',
        stateMan.servName,
        RemoteService.name,
        SessionService.name,
        RouteControl.name,
        '$stateParams'
    ];
    name: string;
    price: number;
    onePageMode = false;
    banners: any[] = [];
    bannerBuilders: any[] = [];
    detail1: string;
    detail2: string;

    bannerIndex = 2;
    swipeTimeout = -1;
    isActive(index) {
        return index === ((this.bannerIndex % this.banners.length) + this.banners.length) % this.banners.length;
    }
    bannerTransform() {
        let result = `translateX(${document.body.clientWidth / 1920 * 1405 * (this.bannerIndex) * -1}px)`;
        return result;
    }
    bannerSwipeLeft() {
        if (this.swipeTimeout < 0) {
            --this.bannerIndex;
            let right = (((this.bannerIndex + (this.banners.length - 3)) % this.banners.length) + this.banners.length) % this.banners.length;
            let left = (right + 1) % this.banners.length;
            console.debug('swipe:', this.bannerIndex, left, right);
            this.banners[left].round--;
            // this.bannerIndex > 0 ? --this.bannerIndex : 0        
            this.$scope.$apply();
            this.swipeTimeout = 1;
            setTimeout(() => {
                this.swipeTimeout = -1;
            }, 300)
        }
    }
    bannerSwipeRight() {
        if (this.swipeTimeout < 0) {
            ++this.bannerIndex;
            let right = (((this.bannerIndex + (this.banners.length - 3)) % this.banners.length) + this.banners.length) % this.banners.length;
            let left = (right + 1) % this.banners.length;
            console.debug('swipe:', this.bannerIndex, left, right);

            this.banners[right].round++;
            // this.bannerIndex < this.banners.length - 1 ? ++this.bannerIndex : 0
            this.$scope.$apply();
            this.swipeTimeout = 1;
            setTimeout(() => {
                this.swipeTimeout = -1;
            }, 300)
        }
    }

    buy() {
        console.log('buy');
        let appname = this.session.appName;
        this.rc.popThis();
        this.$state.go('pay', { appname: appname, product: this.name, price: this.price, productId: this.sp.productId });
    }

    buyCheckOnePage(){
        if(this.onePageMode){
            this.buy();
        }
    }

    constructor(public $scope: IDetailControllerScope,
        public $state: router.StateService,
        public stateMan: stateMan.StateManServ,
        public remote: RemoteService,
        public session: SessionService,
        public rc: RouteControl,
        public sp: { columnId: number, productId: number }) {
        stateMan.setActive('btn-detail-hidden');
        remote.getProductById(sp.columnId, sp.productId)
            .then(result => {
                let data = result.data.data;
                this.name = data.productName;

                this.price = data.productPrice / 100;
                let banners = data.productBanners;

                if (banners.length === 0) {
                    // 出错
                } else if (banners.length === 1) {
                    this.onePageMode = true;
                } else if (banners.length === 2) {
                    banners = banners.concat(banners).concat(banners);
                } else if (banners.length > 2 && banners.length < 5) {
                    banners = banners.concat(banners);
                }

                banners.unshift(banners.pop());
                this.banners = banners.map((src, index) => ({
                    src,
                    index,
                    round: 0,
                    getOffsetX() {
                        return document.body.clientWidth / 1920 * 1405 * (this.round * banners.length + this.index);
                    }
                }))
                this.detail1 = data.productDetail1;
                this.detail2 = data.productDetail2;
            })
    }

}

export default new Page('cydoctor.pages.detail', 'detail', DetailController, template, '/detail/:columnId/:productId');