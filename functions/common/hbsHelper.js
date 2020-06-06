const _ = require('lodash');

const helper = {

    getCornerName: function (cornerId) {
        switch (cornerId) {
            case 'E59C': return 'KOREAN I'
            case 'E5EC': return 'KOREAN I'
            case 'E59D': return 'KOREAN II'
            case 'E59E': return 'WESTERN'
            case 'E59F': return '탕맛기픈'
            case 'E59G': return '가츠엔'
            case 'E59H': return 'TAKE OUT'
            case 'E59I': return 'Snap sanck'
            case 'E5E6': return 'XingFu CHINA'
            case 'E5E7': return '우리미각 면'
            case 'E5E8': return 'Napolipoli'
            case 'E5E9': return '고슬고슬비빈'
            case 'E5EA': return 'asia picks'
            case 'E5EB': return 'Chef\'s Counter'
            case 'E5EC': return 'KOREAN I'
            case 'E5ED': return 'KOREAN II'
            default:
                return cornerId;
        }
    },

    toUpperCase: function (str) {
        if (_.isEmpty(str)) {
            return '';
        }

        return str.toUpperCase();
    },

    getImagePath: function (str) {
        if (_.startsWith(str, '../')) {
            return _.replace(str, '../', 'http://www.sdsfoodmenu.co.kr:9106/foodcourt/');
        } else {
            return str;
        }
    },

};

module.exports = helper;