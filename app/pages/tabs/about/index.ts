import * as angular from 'angular';
import { IController, Page } from '../../Page';
import { StateService } from 'angular-ui-router';
import { RemoteService } from "../../../common/remote";
import { NativeService } from '../../../common/native';
import { RouteControl } from '../../../common/routeControl';

declare let require;
let styles = require('./style.styl');
let template = require('./template.html');

export interface IAboutTabScope extends angular.IScope { }
export class AboutTabController implements IController {
    static $inject = [
        '$scope',
        '$state',
        RemoteService.name,
        NativeService.name,
        RouteControl.name,
        '$stateParams'
    ];
    logoUrl: string;
    btnTitle: string;
    desc: string;
    cloudpId: string;
    showPopup: boolean = false;
    slogon: string;
    popupCtrl: {
        show: () => void,
        setId: (id) => void,
        stateId:string
    } = { show: null, setId: null,stateId:'btn-about' };
    call() {
        console.log(this.popupCtrl);
        this.popupCtrl.setId(this.cloudpId);
        this.popupCtrl.show();
    }
    constructor(
        public $scope: IAboutTabScope,
        public $state: StateService,
        public remote: RemoteService,
        public native: NativeService,
        public rc: RouteControl,
        public sp: { id: string }
    ) {
        rc.clearStack();
        remote.getAbouts(sp.id).then(result => {
            this.logoUrl = result.data.data.logoUrl;
            this.btnTitle = result.data.data.serviceButtonTitle;
            this.desc = result.data.data.aboutDesc;
            this.cloudpId = result.data.data.serviceCloudpId;
            this.slogon = result.data.data.slogon;
        })
    }
}
export default new Page('cydoctor.pages.tabs.about', 'tabs.about', AboutTabController, template, '/about/:id')