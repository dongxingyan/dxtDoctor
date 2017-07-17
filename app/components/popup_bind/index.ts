import * as angular from 'angular';
import { NativeService } from '../../common/native';
import { RouteControl } from '../../common/routeControl';
import { StateManServ } from '../../directives/state';

declare let require: Function;
let template = require('./template.html');
let style = require('./style.styl');

export let name = 'app.components.popup.bind';

interface IPopupScope extends angular.IScope {
    popupShow: boolean;
    popupDialNum: string;
    dial: (video_status: boolean) => void;
}


angular.module(name, [])
    .directive('popupBind', function () {

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
                    $scope.popupShow=false;
                    let ctrl = $scope.$eval(attrs.ctrl);

                    ctrl.show = function () {
                        $scope.popupShow = true;                        
                        sm.setActive('btn-popup-video');
                        $scope.$apply();
                        rc.registerBackBtn(() => {
                            $scope.popupShow = false;
                        });
                    }
                    ctrl.setId = function (id) {
                        console.log("setId");
                        $scope.popupDialNum = id;
                    }

                    $scope.dial = function (video_status) {
                        native.dialDxt($scope.popupDialNum, video_status)
                            .then(function (res) {
                                console.log('dial result:', res);
                                $('#log-output').text(`dial result: ${JSON.stringify(res)}`)
                            })
                    }


                    sm['dial'] = $scope.dial;
                }]

        }
    })

