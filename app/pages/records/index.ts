import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { Page, IController } from '../Page';
import * as stateMan from '../../directives/state';
import { RemoteService, Payments } from "../../common/remote";
import { RouteControl } from '../../common/routeControl';


declare let require; // 为webpack的require语法所做的特殊声明
let styles = require('./style.styl');
let template = require('./template.html');

export interface IRecordsControllerScope extends angular.IScope {
}

export class RecordsController implements IController {
    static $inject = [
        '$scope',
        '$state',
        stateMan.servName,
        RemoteService.name,
        RouteControl.name,
        '$stateParams'
    ];
    list: Payments[] = [];

    up() {
        if (this.mark != 0) {
            this.mark--
            this.$scope.$apply();
        } else {
            if (this.startMark > 0) {
                this.startMark--
                this.$scope.$apply();
            } else {
                this.rc.goBack();
            }
        }

    }

    down() {
        if (this.mark < 3) {
            if (this.mark < this.cachedRecords.length - 1) {
                this.mark++;
                this.$scope.$apply();
            }
        } else {
            if (this.cachedRecords.length <= 4) {
                return;
            }
            if (this._hasNext) {
                if (this.startMark >= this.cachedRecords.length - 8) {
                    this.startMark++;
                    this.getMore();
                } else {
                    this.startMark++;
                }
            } else {
                if (this.startMark < this.cachedRecords.length - 4) {
                    this.startMark++;
                }
            }
            this.$scope.$apply();
        }
    }

    _hasNext = true;

    hasNext() {
        // 没有加载完毕返回true
        if (this._hasNext) {
            return true;
        }
        if (!this._hasNext && this.startMark >= this.cachedRecords.length - 4) {
            return false;
        } if (!this._hasNext && this.cachedRecords.length <= 4) {
            return false;
        } else {
            return true;
        }
    }

    hasPrev() {
        return this.startMark > 0;
    }
    // 页面大小
    static SIZE = 4;
    // 光标的位置
    mark = 0;
    // 屏幕显示的第一条的位置
    startMark = 0;
    // 缓存起来的付款记录
    cachedRecords = [];
    // 按页面加载的标记
    pageMark = 0;
    // 尝试从网络拉取更多数据
    getMore() {
        return this._hasNext && this.remote.getPayments(this.pageMark, RecordsController.SIZE)
            .then(result => {
                let items = result.data.data.map(item => ({
                    updateTime: item.updateTime,
                    appName: item.appName,
                    productName: item.productName,
                    tradeNo: item.appTradeNo,
                    totalFee: item.totalFee,
                    verificationCode: item.verificationCode
                }));
                if (items.length < RecordsController.SIZE) {
                    this._hasNext = false;
                }
                let i = this.pageMark * RecordsController.SIZE;
                for (let j = 0; j < RecordsController.SIZE; j++) {
                    if (items[j]) {
                        this.cachedRecords[i + j] = items[j];
                    }
                }
                this.pageMark++;
                console.debug('records:', this.cachedRecords);
            });
    }

    checkRecords() {

    }
    getRecords() {
        let result = this.cachedRecords.slice(this.startMark, this.startMark + RecordsController.SIZE);
        // console.debug('',this.cachedRecords)
        // console.debug('slice '+`${this.startMark}~${this.startMark + RecordsController.SIZE}`,result)
        return result;
    }

    constructor(public $scope: IRecordsControllerScope,
        public $state: router.StateService,
        public stateMan: stateMan.StateManServ,
        public remote: RemoteService,
        public rc: RouteControl,
        public sp: { page: string }) {
        this.getMore()
            .then(() => {
                if (this._hasNext) {
                    this.getMore();
                }
            })
        this.stateMan.setActive('records-list');

    }

}

export default new Page('cydoctor.pages.records', 'records', RecordsController, template, '/records/:page');