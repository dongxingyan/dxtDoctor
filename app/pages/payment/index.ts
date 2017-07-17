import * as angular from 'angular';
import * as router from 'angular-ui-router';
import { Page, IController } from '../Page';
import * as stateMan from '../../directives/state';
import { RemoteService, Prepay, Response } from '../../common/remote';
import { NativeService } from "../../common/native";
import { RouteControl } from '../../common/routeControl';


declare let require; // 为webpack的require语法所做的特殊声明
let styles = require('./style.styl');
let template = require('./template.html');

export interface IPaymentControllerScope extends angular.IScope {
}

export class PaymentController implements IController {
    static $inject = [
        '$scope',
        '$state',
        stateMan.servName,
        RemoteService.name,
        NativeService.name,
        RouteControl.name,
        '$stateParams',
    ];
    data: Prepay;

    handlePayResult(result) {
        if (result.resultCode == '0') {
            // 成功
            this.rc.popThis();
            this.rc.go('paysuccess');
        } else if (result.resultCode == '1') {
            // 失败
            console.log('支付失败');
        } else if (result.resultCode == '2') {
            // 取消
            console.log('支付取消');
        } else {
            console.log('订单生成失败');
        }
    }

    checkBindPhone() {
        console.log('check bind phone');
        return this.remote.getConfirmations().then(res => {
            console.log('check bind phone res', res);
            if (res.data.code == 200) {
                return Promise.resolve(res)
            } else if (res.data.code == 307) {
                setTimeout(() => this.popupCtrl.show(), 300);
                return Promise.reject(res);
            } else {
                return Promise.reject(res);
            }
        })
    }

    wxpay() {
        this.checkBindPhone()
            .then((res: angular.IHttpPromiseCallbackArg<Response<{
                // 状态码
                code: number,
                // 信息
                msg: string,
                // 返回数据
                data?: string,
            }>>) => {
                console.log('check bind phone pay:', res);
                if (res.data.code === 200)
                    return this.native.dxtScanPay(this.data.appTradeNo, this.sp.appname, this.sp.product, parseFloat(this.sp.price) * 100, 'wxpay', this.data.appNotifyUrl)
            })
            .then((result: any) => {
                if (result.resultCode == '0') {
                    // 成功
                    this.rc.popThis();
                    this.rc.go('paysuccess');
                } else if (result.resultCode == '1') {
                    // 失败
                    console.log('支付失败');
                } else if (result.resultCode == '2') {
                    // 取消
                    console.log('支付取消');
                } else {
                    console.log('订单生成失败');
                }
            })
            .catch((res) => {
                console.log('have not bind phone');
            });
    }
    popupCtrl: any = {}

    alipay() {
        this.checkBindPhone()
            .then(() => {
                console.log('check bind phone pay');
                return this.native.dxtScanPay(this.data.appTradeNo, this.sp.appname, this.sp.product, parseFloat(this.sp.price) * 100, 'alipay', this.data.appNotifyUrl)
            })
            .then((result: any) => {
                if (result.resultCode == '0') {
                    // 成功
                    this.rc.popThis();
                    this.rc.go('paysuccess');
                } else if (result.resultCode == '1') {
                    // 失败
                    console.log('支付失败');
                } else if (result.resultCode == '2') {
                    // 取消
                    console.log('支付取消');
                } else {
                    console.log('订单生成失败');
                }
            })
            .catch((res) => {
            });
    }

    constructor(public $scope: IPaymentControllerScope,
        public $state: router.StateService,
        public stateMan: stateMan.StateManServ,
        public remote: RemoteService,
        public native: NativeService,
        public rc: RouteControl,
        public sp: { appname: string, product: string, productId: string, price: string }) {
        stateMan.setActive('payment-alipay');
        remote.createPrepay(sp.productId, parseFloat(sp.price) * 100).then(res => {
            this.data = res.data.data;
        });
        window['state'] = $state;
    }

}

export default new Page('cydoctor.pages.payment', 'pay', PaymentController, template, '/pay/:price/:appname/:product/:productId')