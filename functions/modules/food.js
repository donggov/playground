const axios = require("axios");
const cheerio = require("cheerio");
const moment = require('moment-timezone');
const _ = require('lodash');
const _firebase = require('../common/firebase');

const defaultZoneID = 'AS';
const defaultTimezone = 'Asia/Seoul';
const defaultMenuTime = 'lunch';


const route = {

    foodView: async function (req, res, next) {
        const menuTime = req.query.menuTime || getMenuTime();
        const date = moment().tz("Asia/Seoul").format('YYYY-MM-DD');
        const zoneId = 'AS';
        const docId = date + '-' + zoneId;
        let corners = [];

        try {
            const history = await _firebase.firestore.findCollectionByDocId('delacourt-history', docId);
            if (!_.isEmpty(history.menu) && !_.isEmpty(history.menu[menuTime])) {
                menus = history.menu[menuTime];
            }

            _.remove(menus, function (o) {
                return o.cornerId === 'E59H' || o.cornerId === 'E59I';
            });

            corners = _.chain(menus)
                .groupBy('cornerId')
                .map((value, key) => ({
                    cornerId: key,
                    menus: value
                }))
                .value();

        } catch (err) {
            console.error("Get menu error : " + err);
        }

        res.render('food', {
            date: moment().tz("Asia/Seoul").format('YYYY-MM-DD dddd'),
            menuTime: menuTime,
            corners: corners,
        });
    },

    createDelacourtHistory: async function (req, res, next) {
        const zoneId = 'AS';
        const id = generateDocId(zoneId);

        let menu = {};
        for (const menuTime of [ 'breakfast', 'lunch', 'dinner' ]) {
            console.log(menuTime);
            try {
                const response = await getAxios(generateDelacourtUrl(zoneId, menuTime));
                menu[menuTime] = convertHtmlToMenu(response.data);

            } catch (error) {
                console.error("Loop error : " + error);
            }
        }

        const data = {
            id: id,
            date: moment().tz(defaultTimezone).format('YYYY-MM-DD'),
            zoneId: zoneId,
            createdAt: moment().tz(defaultTimezone).format(),
            menu: menu,
        };

        try {
            await _firebase.firestore.saveCollection('delacourt-history', id, data);

        } catch (err) {
            console.error("Create menu error : " + err);
        }

        res.json(data);
    },

}


function getMenuTime() {
    // const time = moment().tz(defaultTimezone).format('HHmm')
    // if (time >= 0 && time <= 830) {
    //     return 'breakfast';
    // } else if (time > 830 && time <= 1400) {
    //     return 'lunch';
    // } else {
    //     return 'dinner';
    // }

    return 'lunch';
}

function generateDocId(zoneId) {
    zoneId = zoneId || defaultZoneID;
    return moment().tz(defaultTimezone).format('YYYY-MM-DD') + '-' + zoneId;
}

function generateDelacourtUrl(zoneId, menuTime) {
    let url = 'http://www.sdsfoodmenu.co.kr:9106/foodcourt/menuplanner/list';
    url += '?zoneId=' + (zoneId || defaultZoneID);
    url += '&menuTime=' + (menuTime || defaultMenuTime);
    return url;
}

async function getAxios(url) {
    let result;

    try {
        await axios.get(url)
            .then(function (response) {
                result = response;
            })
            .catch(function (error) {
                console.error("error axios : " + error);
                throw new Error("axios error : " + error);
            });

    } catch (error) {
        throw new Error("axios await error : " + error);
    }

    return result;
}

function convertHtmlToMenu(html) {
    let menuList = [];

    const $ = cheerio.load(html);
    const $cornerList = $("div.mo-contents").children("div.corner");
    $cornerList.each(function (i, corner) {
        const cornerId = $(corner).attr('id');
        const cornerTitleImg = $(corner).find('div.corner-title Img').attr('src');
        const numFloorImg = $(corner).find('div.num-floor Img').attr('src') || '';

        const $menuList = $(corner).children('dl.menu');
        $menuList.each(function (i2, menu) {
            const title = $(menu).find('dt.menu-title').text();
            const detail = $(menu).find('span').first().text();
            const calorie = $(menu).find('span.menu-calorie').text();
            const img = $(menu).next().find('img').attr('src');

            menuList.push({
                cornerId: cornerId,
                cornerTitleImg: cornerTitleImg,
                numFloorImg: numFloorImg,
                title: title,
                detail: detail,
                calorie: calorie,
                img: img,
            });
        });

    });

    return menuList;
}


module.exports = {
    route: route,
}