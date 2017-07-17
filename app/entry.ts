declare let require;

var $ = require('jquery');
window['jQuery'] = $;
window['$'] = $;

import * as app from './app';

let requires = [app];
