import { serverPath } from '../global'
import { SessionService } from './session';
import * as angular from 'angular';
export let name = 'native';

declare let dxtApp: any;


export class NativeService {
    static $inject = [SessionService.name];

    constructor(public session: SessionService) {

    }

    dialDxt(cloudpId, video_status?: boolean) {
        return new Promise(function (resolve, reject) {
            try {
                if (!!window['dxtApp']) {
                    dxtApp.dialDxt({
                        cloudpId: cloudpId,
                        video_status: video_status
                    }, function (res) {
                        resolve(res);
                    });
                }
            } catch (error) {
                reject('拨号时发生错误: ' + error)
            }
        })
    }

    /**
     * payChannel: wxpay|alipay|apple,传空表示使用app的所有的支付方式，传递一个或者多个（逗号分隔），则表示 希望app用传递的支付方式。        
     */
    dxtScanPay(appTradeNo: string, title: string, detail: string, totalFee: number, payChannel: string, notifyUrl: string) {
        return new Promise((resolve, reject) => {
            dxtApp && dxtApp.dxtScanPay({
                appid: this.session.appId,
                openid: this.session.openid,
                app_trade_no: appTradeNo,
                good_title: title,
                good_detail: detail,
                total_fee: totalFee,
                pay_channel: payChannel, //wxpay|alipay|apple,传空表示使用app的所有的支付方式，传递一个或者多个（逗号分隔），则表示 希望app用传递的支付方式。        
                notify_url: notifyUrl
            },
                function (res) {
                    //根据res.resultCode分别进行处理  
                    resolve(res);
                })
        })
    }
}

angular.module(name, [])
    .service(NativeService.name, NativeService);