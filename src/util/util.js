const Util = {

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

    isList: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            return true;
        }
        return false;
    },

    hasOwn: function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    isCE($elem) {
        if ($elem && $elem.tagName && $elem.tagName.includes('-')) {
            return true;
        }
        return false;
    },

    classMap(obj) {
        const ls = [];
        if (obj) {
            Object.keys(obj).forEach((key) => {
                if (obj[key]) {
                    ls.push(key);
                }
            });
        }
        return ls.join(' ');
    },

    styleMap(obj) {
        const ls = [];
        if (obj) {
            Object.keys(obj).forEach((key) => {
                const v = obj[key];
                if (v || v === 0) {
                    ls.push(`${key}:${v};`);
                }
            });
        }
        return ls.join(' ');
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