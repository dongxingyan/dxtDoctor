import * as angular from 'angular';
import { NativeService } from '../../common/native';
import { RouteControl } from '../../common/routeControl';
import { StateManServ } from '../../directives/state';

declare let require: Function;
let template = require('./template.html');
let style = require('./style.styl');

export let name = 'app.components.popup';

interface IPopupScope extends angular.IScope {
    popupShow: boolean;
    popupDialNum: string;
    dial: (video_status: boolean) => void;
}


angular.module(name, [])
    .directive('popupDial', function () {

        return {
            template: template,
            scope: true,
            replace: true,
            controller: ['$scope',
                NativeService.name,
                RouteControl.name,
                'StateMan',
                "$attrs",
                function ($scope: IPopupScope, native: NativeService, rc: RouteControl, sm: StateManServ, attrs) {
                    // rc.clearStack();


                    let ctrl = $scope.$eval(attrs.ctrl);

                    ctrl.show = function () {
                        $scope.popupShow = true;
                        sm.setActive('btn-popup-video');
                        $scope.$apply();
                        rc.registerBackBtn(() => {
                            $scope.popupShow = false;
                            sm.setActive(ctrl.stateId);
                        });
                    }
                    ctrl.setId = function (id) {
                        console.log("setId", id);
                        $scope.popupDialNum = id;
                    }

                    $scope.dial = function (video_status) {
                        console.debug('正在呼叫', $scope.popupDialNum, video_status);
                        // 我也搞不明白为什么native那边就是没回应……不过每一步都写上大概就没问题了。
                        $scope.popupShow = false;
                        sm.setActive(ctrl.stateId);
                        try {
                            native.dialDxt($scope.popupDialNum, video_status)
                                .then(function (res) {
                                    console.log('dial result:', res);
                                    $scope.popupShow = false;
                                    sm.setActive(ctrl.stateId);
                                }).catch(error => {
                                    console.error(error);
                                    $scope.popupShow = false;
                                    sm.setActive(ctrl.stateId);
                                })
                        } catch (error) {
                            $scope.popupShow = false;
                            sm.setActive(ctrl.stateId);
                        } finally {
                            $scope.popupShow = false;
                            sm.setActive(ctrl.stateId);
                        }
                    }


                    sm['dial'] = $scope.dial;
                }]

        }
    })

