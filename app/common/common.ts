/**
 * 整理common文件夹下的各个文件
 */

import * as angular from 'angular';
import * as session from './session';
import * as remote from './remote'
import * as rc from './routeControl';
import * as native from './native'
export let name = 'common';


angular.module(name, [session.name, remote.name, rc.name, native.name]);