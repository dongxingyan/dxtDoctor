declare let require; // 为webpack的require语法所做的特殊声明

import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { StateService } from "angular-ui-router";
import tabs from '../tabs';
import home from '../tabs/home'
import { Page, IController } from '../Page';
import { SessionService } from '../../common/session';
import { RemoteService, Tab } from '../../common/remote';
import { RouteControl } from '../../common/routeControl';
import IHttpResponseTransformer = angular.IHttpResponseTransformer;

let mAlert = alert;

export let name = 'me.pages.loading';

require('./loading.styl');
let template = require('./loading.tmpl.html');

export let component = 'loading';

interface ILoginScope extends angular.IScope {

}
class LoadingController implements IController {
    static $inject: string[] = [
        '$scope',
        '$state',
        SessionService.name,
        RemoteService.name,
        RouteControl.name,
    ];
    errorMessage: string;

    constructor(public $scope: ILoginScope,
        public $state: router.StateService,
        public session: SessionService,
        public remote: RemoteService,
        public rc: RouteControl, ) {
        remote.getColumns().then((res) => {
            session.tabs = res.data.data;
            this.goToIndex();

        }).catch(reason => {
            this.errorMessage = '网络连接错误或服务器错误，请稍后尝试';
        })

    }

    goToIndex() {
        console.log(this.session.tabs);
        if (this.session.tabs.length == 0) {
            alert('没有栏目');
            return;
        }
        let tab = this.session.tabs[0];
        let sref = (() => {
            switch (tab.columnType) {
                case 1:
                    return (`tabs.home`);
                case 2:
                    return (`tabs.list`);
                case 3:
                    return (`tabs.about`);
            }
        })();
        this.$state.go('tabs.home', { id: tab.columnId, page: 1 });
        this.rc.popThis();
    }
}
export let page = new Page(name, component, LoadingController, template);