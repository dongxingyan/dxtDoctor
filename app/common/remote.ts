import * as angular from 'angular';
import { serverPath } from '../global';
import { SessionService } from './session';
export let name = 'remote';

export class Response<T> {
    "code": number;
    "msg": string;
    data?: T;
}

export class Tab {
    "columnId": number;
    "columnName": string;
    "columnType": number;
    "columnUrl": string;
}

export class ListResponse extends Response<ListItem[]> {
    data: ListItem[]
    "pageEntity": {
        "page": number,
        "pageSize": number,
        "prePage": number,
        "nextPage": number,
        "startRow": number,
        "maxPage": number,
        "totalPageSize": number
    }
}

export class ListItem {
    "productId": number;
    "productName": string;
    "productDesc": string;
    "productPrice": number
}

export class CustomerServiceData {
    /**
     * 手机端的服务图片，最多5张，图片的URL列表，逗号分隔，url包括域名,
     */
    banners: string[];
    /**
     * 业务范围
     */
    businessDesc: string;
    /**
     * 服务时间描述
     */
    serviceTimeDesc: string;
    /**
     * 客服
     */
    serviceCloudpId: number;
    /**
     * 呼叫按钮标题
     */
    serviceButtonTitle: string;
}

export class AboutsData {
    /**
     * logo
     */
    logoUrl: string;

    slogon?: string;
    /**
     * 关于内容
     */
    aboutDesc: string;
    /**
     * 客服cloudpId
     */
    serviceCloudpId: string;
    /**
     * 呼叫按钮标题
     */
    serviceButtonTitle: string;
}

export class DetailData {
    "productName": string;
    "productPrice": number;
    "productBanners": string[];
    "productDetail1": string;
    "productDetail2": string;
}

export class Payments {
    id?: number;
    appId?: string;
    appName?: string;
    cloudpId?: number;
    openId?: string;
    productId?: number;
    productName?: string;
    appTradeNo?: string;
    tradeNo?: string;
    totalFee?: number;
    tradeStatus?: number;
    updateTime?: string;
    verificationCode?: string;
}

export class Prepay {
    appNotifyUrl: string;
    appTradeNo: string;
}

export class RemoteService {
    static $inject = ['$http', SessionService.name];

    constructor(public $http: angular.IHttpService,
        public session: SessionService) {
        console.log('remote serv:', this);
    }

    getColumns() {
        let path = `/v1/open/common/apps/${this.session.appId}/columns`;
        return this.$http<Response<Tab[]>>({
            method: "GET",
            url: serverPath + path,
            params: {
                deviceType: 3
            }
        })
    }

    getAbouts(columnId: string) {
        let path = `/v1/open/common/apps/${this.session.appId}/abouts`;
        return this.$http<Response<AboutsData>>({
            method: "GET",
            url: serverPath + path,
            params: {
                openId: this.session.openid,
                deviceType: 3,
                columnId: columnId,
            }
        })
    }

    createPrepay(productId: string, totalFee: number) {
        let path = `/v1/open/common/apps/${this.session.appId}/products/${productId}/prepay`;
        return this.$http<Response<Prepay>>({
            method: "POST",
            url: serverPath + path,
            params: {
                openId: this.session.openid,
                totalFee: totalFee
            }
        })
    }

    getProducts(columnId: number, page: number, size: number) {
        let path = `/v1/open/common/apps/${this.session.appId}/products`;
        return this.$http<ListResponse>({
            method: "GET",
            url: serverPath + path,
            params: {
                openId: this.session.openid,
                deviceType: 3,
                columnId: columnId,
                page: page,
                pageSize: size
            }
        })
    }

    getProductById(columnId: number, productId: number) {
        // let path = `/v1/open/common/apps/${this.session.appId}/products`;
        let path = `/v1/open/common/apps/${this.session.appId}/products/{productId}`;
        return this.$http<Response<DetailData>>({
            method: "GET",
            url: serverPath + path,
            params: {
                openId: this.session.openid,
                deviceType: 3,
                columnId: columnId,
                productId: productId,
            }
        })
    }

    getCustomerService(columnId: number) {
        let path = `/v1/open/common/apps/${this.session.appId}/customerservice`;
        return this.$http<Response<CustomerServiceData>>({
            method: "GET",
            url: serverPath + path,
            params: {
                openId: this.session.openid,
                deviceType: 3,
                columnId: columnId
            }
        })
    }


    getConfirmations() {
        let path = `/v1/open/common/apps/${this.session.appId}/users/${this.session.openid}/mobile/confirmations`
        return this.$http<Response<{
            // 状态码
            code: number,
            // 信息
            msg: string,
            // 返回数据
            data?: string,
        }>>({
            method: "GET",
            url: serverPath + path
        })
    }

    getPayments(page: number, size: number) {
        // let path = `/v1/open/common/apps/${this.session.appId}/products`;
        let path = `/v1/open/common/apps/${this.session.appId}/users/${this.session.openid}/payments`;
        return this.$http<Response<Payments[]>>({
            method: "GET",
            url: serverPath + path,
            params: {
                page: page,
                pageSize: size
            }
        })
    }
}

angular.module(name, [])
    .service(RemoteService.name, RemoteService);