import * as angular from 'angular';
import { IController, Page } from '../../Page';
import { StateService } from 'angular-ui-router';
import { SessionService } from "../../../common/session";
import { RemoteService } from "../../../common/remote";
import { NativeService } from "../../../common/native";
import { RouteControl } from '../../../common/routeControl';
export let name = 'home';

declare let require;
let styles = require('./style.styl');
let template = require('./template.html');

export interface IHomeTabScope extends angular.IScope {
}
export class HomeTabController implements IController {
    static $inject = [
        '$scope',
        '$state',
        SessionService.name,
        RemoteService.name,
        NativeService.name,
        RouteControl.name,
        '$stateParams'
    ];
    cloudpId: string | number;
    btnTitle: string;
    businessDesc: string;
    servTimeDesc: string[];
    showPopup: boolean = false;
    popupCtrl: { show?: any, setId?: any, stateId: string }

    call() {
        this.popupCtrl.setId(this.cloudpId);
        this.popupCtrl.show();
        this.$scope.$apply();

        // this.native.dialDxt(this.cloudpId);
    }

    constructor(public $scope: IHomeTabScope,
        public $state: StateService,
        public session: SessionService,
        public remote: RemoteService,
        public native: NativeService,
        public rc: RouteControl,
        sp: { id: string }) {
        rc.clearStack();
        this.popupCtrl = { stateId: 'btn-index' };
        remote.getCustomerService(parseInt(sp.id)).then(result => {
            let data = result.data.data;
            this.imgUrl = result.data.data.banners[0];
            this.cloudpId = result.data.data.serviceCloudpId;
            this.btnTitle = data.serviceButtonTitle;
            this.businessDesc = data.businessDesc;
            this.servTimeDesc = data.serviceTimeDesc.split('\n');
        })

    }

    imgUrl: string;

}
export default new Page('cydoctor.pages.tabs.home', 'tabs.home', HomeTabController, template, '/home/:id')