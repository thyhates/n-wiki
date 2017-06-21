/**
 * Created by thyhates on 2017/6/4.
 */
import utils from '../utils/utils'

function getDocumentList() {
    return new Promise((resolve, reject) => {
        utils.post({
            url:'/getAllDocs',
            data:{}
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
            reject(res);
        })
    })

}

function getApis({id}) {
    return new Promise((resolve, reject) => {
        utils.post({
            url:'/getDocument',
            data:{
                id:id
            }
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
            reject(res);
        })
    })
}

function getLogs() {
    return new Promise((resolve, reject) => {
        utils.post({
            url:'/getLog',
            data:{}
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
            reject(res);
        })
    })
}


function getApiDetail({id}) {
    return new Promise((resolve, reject) => {
        utils.post({
            url:'/selectApi',
            data:{
                id
            }
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
            reject(res);
        })
    })
}
function getErrorCode({id}) {
    return new Promise((resolve, reject) => {
        utils.post({
            url:'/getDocument',
            data:{
                id
            }
        })
            .then(res => {
                resolve(res);
            }).catch(res => {
            reject(res);
        })
    })
}
let data = {
    getDocumentList: getDocumentList,
    getLogs:getLogs,
    getApis:getApis,
    getApiDetail:getApiDetail,
    getErrorCode:getErrorCode
};
export default data;