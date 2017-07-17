import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { Page, IController } from '../Page';
import * as stateMan from '../../directives/state';

import './home'
import './about'
import './list'
import './custom'
import { SessionService } from "../../common/session";
import { Tab, RemoteService } from '../../common/remote';

declare let require; // 为webpack的require语法所做的特殊声明
let styles = require('./style.styl');
let template = require('./template.html');

export interface ITabsControllerScope extends angular.IScope {
}

export class TabsController implements IController {
    message = 'tab page';
    static $inject = [
        '$scope',
        '$state',
        stateMan.servName,
        RemoteService.name,
        SessionService.name,
    ];

    goto(index) {
        let tab = this.session.tabs[index];
        if (tab) {
            switch (tab.columnType) {
                case 1:
                    this.$state.go('tabs.home', { id: tab.columnId });
                    break;
                case 2:
                    this.$state.go('tabs.list', { id: tab.columnId, page: 1 });
                    break;
                case 3:
                    this.$state.go('tabs.about', { id: tab.columnId });
                    break;
                case 4:
                    this.$state.go('tabs.custom', { id: tab.columnId, url: tab.columnUrl });
            }
        }
    }

    constructor(public $scope: ITabsControllerScope,
        public $state: router.StateService,
        public stateMan: stateMan.StateManServ,
        public remote: RemoteService,
        public session: SessionService) {

        if (session.tabs.length === 0) {
            window['state'] = this.$state;
            remote.getColumns().then((res) => {
                session.tabs = res.data.data;
            })
        }
    }

    isActive(tab: Tab) {
        return tab.columnId == this.$state.params['id'];
    }

    getTime() {
        let now = new Date();
        let fixNum = num => ('00' + num).slice(-2);
        return `${fixNum(now.getHours())}:${fixNum(now.getMinutes())}`;
    }

    getTabSref(tab: Tab) {
        switch (tab.columnType) {
            case 1:
                return (`tabs.home({id:${tab.columnId}})`);
            case 2:
                return (`tabs.list({id:${tab.columnId},page:1})`);
            case 3:
                return (`tabs.about({id:${tab.columnId}})`);
            case 4:
                return (`tabs.custom({id:${tab.columnId},url:'${tab.columnUrl}'})`)
        }
    }
}

export default new Page('cydoctor.pages.tabs', 'tabs', TabsController, template)

