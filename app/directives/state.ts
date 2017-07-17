import * as angular from 'angular';
export let name = 'directives.state';
export let servName = 'StateMan';

export class StateManServ {

    $inject = [];

    _actived: string;

    constructor() {
        window['stateman'] = this;
    }

    createState() {
        return Math.random() + '' + Date.now();
    }

    get actived() {
        return this._actived;
    }

    set actived(value) {
        this._actived = value;
    }

    setActive(id) {
        setTimeout(() => {
            $(`[state-id=${id}]>button.wrap`).focus();
        }, 20);
    }

    cached = {};

    cache(key, val?) {
        if (val != undefined) {
            this.cached[key] = val;
        }
        return this.cached[key]
    }
}


class StateIdDirectiveController {
    static $inject = ['$scope', '$attrs', '$element', servName];

    constructor(public $scope: angular.IScope,
                public $attrs: angular.IAttributes,
                public $element: angular.IRootElementService,
                public stateMan: StateManServ) {
        let btn = $element.find('>button.wrap');

        btn.keydown((event) => {
            let up = this.$attrs['keyUp'];
            let down = this.$attrs['keyDown'];
            let left = this.$attrs['keyLeft'];
            let right = this.$attrs['keyRight'];
            let enter = this.$attrs['keyEnter'];

            let readExpr = (expr) => {
                if (/^to#/.test(expr)) {
                    expr = `stateman.to(${expr.split('#').slice(-1)[0]})`
                }
                return expr;
            };

            [up, down, left, right] = [up, down, left, right].map(readExpr);


            let witch = event.which;
            if (left && witch === 37) {
                event.preventDefault();
                $scope.$eval(left);
            }
            if (up && witch === 38) {
                event.preventDefault();
                $scope.$eval(up)
            }
            if (right && witch === 39) {
                event.preventDefault();
                $scope.$eval(right);
            }
            if (down && witch === 40) {
                event.preventDefault();
                $scope.$eval(down);
            }
            if (enter && witch === 13) {
                console.log('on enter press:',$scope,enter);
                event.preventDefault();
                $scope.$eval(enter);
            }
        });

        btn.focus(() => {
            let stateid = this.$attrs['stateId'];
            stateMan.actived = stateid;
            this.$scope.$apply();
        })
    }

    /**
     * 判断当前选中的是不是自己
     */
    isSelected() {
        let stateid = this.$attrs['stateId'],
            acitvedState = this.stateMan.actived;
        return stateid === acitvedState;
    }

    to(id, key?, val?) {
        this.stateMan.setActive(id);
        // 跳转时可能允许进行一次状态缓存
        if (key !== undefined) {
            this.cache(key, val);
        }
    }

    /**
     * 进行一次状态缓存
     */
    cache(key, val) {
        return this.stateMan.cache(key, val);
    }
}

angular.module(name, [])
    .directive('stateId', [function () {
        return {
            scope: true,
            controllerAs: 'stateman',
            controller: StateIdDirectiveController
        }
    }])
    .service(servName, StateManServ);