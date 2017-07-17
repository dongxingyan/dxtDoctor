import * as angular from 'angular';
import * as nutsPage from './page';
import * as componentPopup from './popup_calltype';
import * as componentPopupBind from './popup_bind';
export let name = 'nuts';

export let module = angular.module(name, [
        nutsPage.name,
        componentPopup.name,
        componentPopupBind.name,
]);