
import { uid } from 'uid';

import Microtask from './microtask.js';

const Util = {

    delay: (ms) => {
        return new Promise((resolve) => {
            if (ms) {
                setTimeout(resolve, ms);
            } else {
                setImmediate(resolve);
            }
        });
    },

    isNum: (num) => {
        if (typeof (num) !== 'number' || isNaN(num)) {
            return false;
        }
        const isInvalid = function(n) {
            const N = Number;
            if (n === N.MAX_VALUE || n === N.MIN_VALUE || n === N.NEGATIVE_INFINITY || n === N.POSITIVE_INFINITY) {
                return true;
            }
            return false;
        };
        if (isInvalid(num)) {
            return false;
        }
        return true;
    },

    toNum: (num, toInt) => {
        if (typeof (num) !== 'number') {
            num = parseFloat(num);
        }
        if (isNaN(num)) {
            num = 0;
        }
        if (toInt) {
            num = Math.round(num);
        }
        return num;
    },

    numFix: (num, fix) => {
        const n = Util.toNum;
        let f = Util.isNum(fix) ? fix : 2;
        f = n(f, true);
        num = Math.round((n(num) * Math.pow(10, f + 1)) / 10) / Math.pow(10, f);
        num = num.toFixed(f);
        return num;
    },

    token: (len, pre = '') => {
        let str = Math.random().toString().substr(2);
        if (len) {
            str = str.substr(0, Util.toNum(len));
        }
        return pre + str;
    },

    isList: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            return true;
        }
        return false;
    },

    guid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16);
        });
    },

    uid: (length) => {
        return uid(length);
    },

    createInstanceId: () => {
        return uid();
    },

    hasOwn: function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    replace: (str, obj, defaultValue) => {
        if (typeof str !== 'string' || !obj) {
            return str;
        }
        str = str.replace(/\{([^}]+)\}/g, function(match, key) {

            if (!Util.hasOwn(obj, key)) {
                if (typeof (defaultValue) !== 'undefined') {
                    return defaultValue;
                }
                return match;
            }

            let val = obj[key];

            if (typeof (val) === 'function') {
                val = val(obj, key);
            }

            if (typeof (val) === 'undefined') {
                val = '';
            }

            return val;

        });
        return str;
    },

    getValue: (data, dotPathStr, defaultValue) => {
        if (!dotPathStr) {
            return defaultValue;
        }
        let current = data;
        const list = dotPathStr.split('.');
        const lastKey = list.pop();
        while (current && list.length) {
            const item = list.shift();
            current = current[item];
        }
        if (current && Util.hasOwn(current, lastKey)) {
            const value = current[lastKey];
            if (typeof (value) !== 'undefined') {
                return value;
            }
        }
        return defaultValue;
    },

    toDate: function(input) {
        if (Util.isDate(input)) {
            return input;
        }

        //fix time zone issue by use "/" replace "-"
        const inputHandler = function(t) {
            if (typeof (t) !== 'string') {
                return t;
            }
            t = t.split('-').join('/');
            return t;
        };

        input = inputHandler(input);

        let date = new Date(input);
        if (Util.isDate(date)) {
            return date;
        }

        date = new Date();
        return date;
    },

    isDate: function(date) {
        if (!date || !(date instanceof Date)) {
            return false;
        }
        //is Date Object but Date {Invalid Date}
        if (isNaN(date.getTime())) {
            return false;
        }
        return true;
    },

    //==================================================================================================
    //cookies

    getCookie(key) {
        const cookies = {};
        document.cookie.split(';').forEach((item) => {
            const list = item.split('=');
            const k = decodeURIComponent(list.shift().trim());
            const v = decodeURIComponent(list.join('=').trim());
            cookies[k] = v;
        });
        if (key) {
            return cookies[key];
        }
        return cookies;
    },

    hasCookie(key) {
        const cookies = Util.getCookie();
        return Util.hasOwn(cookies, key);
    },


    setCookie(key, value, expires, path, domain, secure) {
        let s = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        if (Util.isNum(expires)) {
            const date = new Date(Date.now() + expires);
            s += `; expires=${date.toUTCString()}`;
        }
        if (path) {
            s += `; path=${path}`;
        }
        if (domain) {
            s += `; domain=${domain}`;
        }
        if (secure) {
            s += `; secure=${secure}`;
        }

        document.cookie = s;
    },

    delCookie(key, path, domain) {
        Util.setCookie(key, '', 0, path, domain);
    },

    getHash(key) {
        let hash = {};
        const h = location.hash.substr(1);
        if (h) {
            const usp = new URLSearchParams(h);
            hash = Object.fromEntries(usp);
        }
        if (key) {
            return hash[key];
        }
        return hash;
    },

    setHash(key, value) {
        if (!key) {
            return;
        }
        const hash = Util.getHash();
        if (hash[key] === value) {
            return;
        }
        hash[key] = value;
        const usp = new URLSearchParams(hash);
        location.hash = usp.toString();
    },

    delHash(key) {
        if (!key) {
            return;
        }
        const hash = Util.getHash();
        delete hash[key];
        const usp = new URLSearchParams(hash);
        location.hash = usp.toString();
    },

    isCE($elem) {
        if ($elem && $elem.tagName && $elem.tagName.includes('-')) {
            return true;
        }
        return false;
    },

    getRect($elem) {
        const rect = {
            top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, x: 0, y: 0
        };
        if ($elem && typeof $elem.getBoundingClientRect === 'function') {
            const elemRect = $elem.getBoundingClientRect();
            for (const k in elemRect) {
                rect[k] = elemRect[k];
            }
        }
        return rect;
    },

    microtask: function(callback, args, target) {
        return new Microtask(callback, args, target);
    },

    //==================================================================================================

    kebabToPascalCase(text) {
        return (`${text}`).trim()
            .replace(/(^\w|-\w)/g, function(s) {
                return s.replace(/-/, '').toUpperCase();
            });
    },

    pascalToKebabCase(text) {
        return (`${text}`).trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-')
            .toLowerCase();
    },

    formatIndent: function(str = '') {
        str = str.replace(/^\n/g, '');
        str = str.replace(/\n$/g, '');
        const p = str.match(/^\s+/);
        if (p && p[0]) {
            const len = p[0].length;
            const list = [];
            str.split(/\n/g).forEach(function(item) {
                list.push(item.substr(len));
            });
            str = list.join('\n');
        }
        return str;
    },

    jsonParse: function(str) {
        if (typeof str !== 'string') {
            return str;
        }
        str = str.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
        let json;
        try {
            json = JSON.parse(str);
        } catch (e) {
            console.log(e);
        }
        return json;
    },

    BF: function(v, digits = 1, base = 1024) {
        v = Util.toNum(v, true);
        if (v === 0) {
            return '0B';
        }
        let prefix = '';
        if (v < 0) {
            v = Math.abs(v);
            prefix = '-';
        }
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        for (let i = 0, l = units.length; i < l; i++) {
            const min = Math.pow(base, i);
            const max = Math.pow(base, i + 1);
            if (v > min && v < max) {
                const unit = units[i];
                v = prefix + (v / min).toFixed(digits) + unit;
                break;
            }
        }
        return v;
    }
};

export default Util;
