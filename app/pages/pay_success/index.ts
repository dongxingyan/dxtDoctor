import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { Page, IController } from '../Page';
import * as stateMan from '../../directives/state';
import { RouteControl } from '../../common/routeControl';


declare let require; // 为webpack的require语法所做的特殊声明
let styles = require('./style.styl');
let template = require('./template.html');

export interface IPaySuccessControllerScope extends angular.IScope { }

export class PaySuccessController implements IController {
    static $inject = [
        '$scope',
        '$state',
        stateMan.servName,
        RouteControl.name,
    ];
    onOkClicked() {
        let target = this.rc.stateStack[0];
        this.rc.stateStack = [];
        this.$state.go(target.name, target.params);
    }
    onNextClicked() {
        this.rc.goBack();
    }
    constructor(
        public $scope: IPaySuccessControllerScope,
        public $state: router.StateService,
        public stateMan: stateMan.StateManServ,
        public rc: RouteControl
    ) {

    }

}

export default new Page('cydoctor.pages.paysuccess', 'paysuccess', PaySuccessController, template)