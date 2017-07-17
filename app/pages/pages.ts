import * as angular from 'angular';
import * as loading from './loading/loading';
import * as index from './tabs';
import './pay_success'
import './payment'
import './detail'
import './records'
import * as Global from '../global'

export let name = 'me.pages';
let requires = [loading,index];
angular.module(name, Global.pages);