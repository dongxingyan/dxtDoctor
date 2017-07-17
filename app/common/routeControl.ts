import * as angular from 'angular'
import * as router from 'angular-ui-router';
export let name = 'app.routeControl';

declare let dxtApp;

export class RouteControl {
    stateStack = [];
    isIn = true;
    backBtnHandler: () => any = null;
    registerBackBtn(handler) {
        this.backBtnHandler = handler;
    }


    clearStack() {
        setTimeout(() => {
            if (this.stateStack.length > 1) {
                this.stateStack.shift();
                this.stateStack.splice(1);
                console.log('clearStack', this.stateStack);
            }
        }, 100)
    }
    // 回退
    goBack() {
        let target: router.StateDeclaration = this.stateStack[this.stateStack.length - 2];
        if (!!target) {
            this.$state.go(target.name, target.params);
        }
    };

    popThis() {
        this.stateStack.pop();
    };

    go(name, params?) {
        this.$state.go(name, params);
    }
    prevStateName: string;
    static $inject = ['$rootScope', '$state', '$transitions'];

    constructor($rootScope, public $state: router.StateService, $transitions: router.TransitionService) {

        let stateStack = this.stateStack = [];

        // 监听路由变化，管理状态栈
        $transitions.onEnter({}, (transition) => {
            let nextState = transition.to();
            let nowState = stateStack[stateStack.length - 1];
            let prevState = stateStack[stateStack.length - 2];
            this.prevStateName = transition.from().name;
            let params = transition.params(); // 当前的路由参数
            // 值比较状态名和路由参数，确认是否按回退处理
            let isBack = angular.equals(prevState, { name: nextState.name, params: params });
            if (isBack) {
                stateStack.pop();
            } else {
                stateStack.push({ name: nextState.name, params: params });
                let isSame = angular.equals(stateStack[stateStack.length - 1], stateStack[stateStack.length - 2]);
                if (isSame) {
                    stateStack.pop();
                }
            }
            console.log('路由栈:\r\n' + stateStack.map((state, index) => `[${index}] ` + state.name).reverse().join('\r\n'));
        });

        // 回退
        this.goBack = () => {
            let target: router.StateDeclaration = stateStack[stateStack.length - 2];
            if (!!target) {
                $state.go(target.name, target.params);
                return true;
            } else {
                return false;
            }
        };
        this.popThis = () => {
            stateStack.pop();
        };
        this.isIn = true;
        $transitions.onBefore({}, transition => {
            let nextState = transition.to();
            let nowState = stateStack[stateStack.length - 1];
            let prevState = stateStack[stateStack.length - 2];
            let params = transition.params(); // 当前的路由参数
            // 值比较状态名和路由参数，确认是否按回退处理
            let isBack = angular.equals(prevState, { name: nextState.name, params: params });
            let el = document.getElementById('view-container');
            if (isBack) {
                el.className = 'out';
            } else {
                el.className = 'in';
            }
        })
    }
}

angular.module(name, [])
    .service(RouteControl.name, RouteControl)
    .run([RouteControl.name, '$rootScope', function (rc: RouteControl, $rootScope) {
        $rootScope.isIn = () => rc.isIn;
        if (window['dxtApp']) {
            dxtApp.onBackPressed(function (res) {
                if (rc.backBtnHandler) {
                    rc.backBtnHandler();
                    rc.backBtnHandler = null;
                    return;
                }
                if (rc.stateStack)
                    if (!rc.goBack()) {
                        dxtApp.backToDxt();
                    }
            });
        }
    }]);