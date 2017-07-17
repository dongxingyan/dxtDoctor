import * as angular from 'angular';
import { StateProvider } from 'angular-ui-router';
import * as pages from './pages';
import * as Global from '../global';
export interface IController {

}
export class Page<T extends IController> {
    module: angular.IModule;
    constructor(
        /**
         * 模块名
         */
        public moduleName: string,
        /**
         * 组件名（同时也作为ui-router的路由状态名）
         */
        public name: string,
        /**
         * 控制器
         */
        public controller: Function,
        /**
         * 模板
         */
        public template: string,
        /**
         * 路由地址
         */
        public route: string = '/' + name.split('.').slice(-1),
        /**
         * 模块依赖
         */
        public requires: string[] = [],
    ) {
        let module = this.module = angular.module(moduleName, this.requires);
        Global.pages.push(moduleName);
        let componentName = name.split('.').reduce((pv, nv) => pv + nv[0].toUpperCase() + nv.slice(1));
        module
            .component(componentName, {
                template: template,
                controllerAs: 'vm',
                controller: <any>controller
            })
            .config(['$stateProvider', function ($stateProvider: StateProvider) {
                $stateProvider.state({
                    name: name,
                    url: route,
                    component: componentName
                })
            }])
    }
}