/**
 * Created by lzp on 2017/6/30.
 */
import getFormatDate from './date'
import cookie from './cookie'

let getLadderType = function (type) {
    let types={};
    if (type === '0') {
        types.ladderType = 'buyLadder';
        types.inputType = 'amount';
    } else if (type === '1') {
        types.ladderType = 'fallLadder';
        types.inputType = 'price';
    } else if (type === '2') {
        types.ladderType = 'discountLadder';
        types.inputType = 'discount';
    }
    return types;
};

const utils = {
    getFormatDate,
    cookie,
    getLadderType,
};
export default utils;