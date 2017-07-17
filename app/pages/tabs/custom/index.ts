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
    src:string;
    constructor(
        public $scope: IAboutTabScope,
        public $state: StateService,
        public remote: RemoteService,
        public native: NativeService,
        public rc: RouteControl,
        public sp: { id: string,url:string }
    ) {
        this.src = sp.url
        
    }
}
export default new Page('cydoctor.pages.tabs.custom', 'tabs.custom', AboutTabController, template, '/about/:id/:url')