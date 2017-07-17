declare let require;
require('./site.styl');
require('swiper/dist/css/swiper.min.css');
require('swiper/dist/js/swiper');
require('angular-swiper/dist/angular-swiper');
require('angular-animate');
require('./res/fonts/style.css');
require('angular-sanitize');


import * as angular from 'angular'
import * as router from "angular-ui-router";


import * as global from './global'
import * as pages from './pages/pages';
import * as common from './common/common';
import { SessionService } from './common/session';
import * as nuts from './components/nuts'
import * as directives from './directives'
import * as statemanModule from './directives/state';

export let name = 'cydoctor.app';

let requires = [router];

angular.module(name, [
    'ui.router',
    'ksSwiper',
    'ngAnimate',
    'ngSanitize',
    pages.name,
    common.name,
    nuts.name,
    directives.name
])
    .config([
        '$stateProvider', '$urlRouterProvider', '$sceDelegateProvider',
        function ($stateProvider: router.StateProvider,
            // $urlRouterProvider: router.UrlRouterProvider,
            $sceDelegateProvider: angular.ISCEDelegateProvider) {
            // $urlRouterProvider.otherwise('/loading');
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                'https://static-dxt.cloudp.cc/**']);
        }
    ])
    .run(['$transitions', statemanModule.servName,
        function ($transitions: router.TransitionService, stateman: statemanModule.StateManServ) {
            stateman.cache('list-item', 'list-item-1');
            $transitions.onEnter({}, (transition) => {
                let nextState = transition.to();
                let name = nextState.name;
                switch (name) {
                    case 'tabs.home':
                        stateman.cache('tabsDown', 'btn-index');
                        break;
                    case 'tabs.list':
                        stateman.cache('tabsDown', stateman.cache('list-item'));
                        break;
                    case 'tabs.about':
                        stateman.cache('tabsDown', 'btn-about');
                        break;
                    case 'detail':
                        stateman.setActive('btn-detail');
                        break;
                }
                if (transition.from().name === 'loading') {
                    stateman.setActive('tabs-0');
                }
            });

        }])
    .run([
        '$rootScope', '$interval', SessionService.name,
        function ($rootScope, $interval, session: SessionService) {
            $rootScope['root_loader'] = false;
            setTimeout(function () {
                $rootScope['root_loader'] = true;
                $rootScope.$apply();
            }, 1000)
            // 每秒刷新，为了界面上的各种定时器等
            $interval(() => {
            }, 1000);
        }
    ]);