import * as angular from 'angular';
import { IController, Page } from '../../Page';
import { StateService } from 'angular-ui-router';
import { RemoteService, ListItem } from "../../../common/remote";
import { StateManServ } from "../../../directives/state";
import { RouteControl } from '../../../common/routeControl';

declare let require;
let styles = require('./style.styl');
let template = require('./template.html');

export interface IListTabScope extends angular.IScope {
}
export class ListTabController implements IController {

    data: ListItem[];
    page: number;
    maxPage: number;

    hasNext() {
        return this.page < this.maxPage;
    }

    hasPrev() {
        return this.page > 1;
    }

    nextPage() {
        if (this.hasNext()) {
            this.$state.go('tabs.list', { id: this.sp.id, page: this.page - 0 + 1 })
        }
    }

    prevPage() {
        if (this.hasPrev()) {
            this.$state.go('tabs.list', { id: this.sp.id, page: this.page - 1 })
        }
    }

    go(item: ListItem) {
        this.$state.go('detail', { columnId: this.sp.id, productId: item.productId })
    }

    static $inject = [
        '$scope',
        '$state',
        RemoteService.name,
        'StateMan',
        RouteControl.name,
        '$stateParams',

    ];

    constructor(public $scope: IListTabScope,
        public $state: StateService,
        public remote: RemoteService,
        public stateMan: StateManServ,
        public rc: RouteControl,
        public sp: { id: number, page: number }) {
        rc.clearStack();
        remote.getProducts(sp.id, sp.page, 4).then(x => {
            this.data = x.data.data;
            this.page = sp.page;
            this.maxPage = x.data.pageEntity.totalPageSize;
            let prevPage = rc.prevStateName;
            console.log('prev', prevPage)
            if (prevPage === 'tabs.home' || prevPage === 'tabs.about' || prevPage === null) {
            } else {
                console.log(stateMan.cache('list-item'))
                stateMan.setActive(stateMan.cache('list-item'));
            }
        });


    }
}
let page = new Page('cydoctor.pages.tabs.list', 'tabs.list', ListTabController, template, '/list/:id/:page');
export default page;
page.module.directive('listItem', function () {
    return {
        template: `<div ui-sref="detail({columnId:columnId,productId:item.productId})" ng-show="item" class="list-item">
                        <div class="item-top">                        
                            <p>{{item.productName}}</p>
                        </div>
                        <div class="item-bottom">
                            <div class="desc">{{item.productDesc}}</div>
                            <div class="price" ng-if="item.productPrice%100==0">{{item.productPrice/100|currency:'￥':0}}</div>
                            <div class="price" ng-if="item.productPrice%100!=0">{{item.productPrice/100|currency:'￥':2}}</div>
                        </div>
                    </div>`,
        scope: { item: '<', columnId: '<' }
    }
});