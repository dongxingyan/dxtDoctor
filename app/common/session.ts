import * as angular from 'angular';
import {Tab} from "./remote";
export let name = 'session';

export class SessionService {
    $inject = [];
    deviceType: string;
    language: string;
    nickName: string;
    openid: string;
    appId: string;
    timeStamp: string;
    // tabs: Tab[] = [
    //     {"columnId": 1, "columnName": "家庭小护士", "columnType": 1},
    //     {"columnId": 2, "columnName": "产品列表", "columnType": 2},
    //     {"columnId": 3, "columnName": "关于", "columnType": 3}
    // ];
    tabs: Tab[] = [];
    appName: string;

    constructor() {

        window['session'] = this;
        let params: any = location.search.split(/[\?&]/).filter(x => x).reduce((pv, x: any) => {
            let pair = x.split('=');
            pv[pair[0]] = pair[1];
            return pv;
        }, {});
        window['params'] = params;
        this.deviceType = params.deviceType;
        this.language = params.language;
        this.nickName = decodeURI(params.nickname);
        this.openid = params.openId;
        this.appId = params.appId;
        this.timeStamp = params.timeStamp;
        this.appName = decodeURI(params.appName);
    }
}

angular.module(name, [])
    .service(SessionService.name, SessionService);