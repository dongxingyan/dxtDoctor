import * as angular from 'angular';
declare let require: any;
let style = require('./style.styl');
let template = require('./template.html');
export let name = 'nuts.page';
angular.module(name,[])
    .directive('nutsPage', [function () {
        return {
            template: template,
            transclude: true,
            replace:true
        }
    }]);