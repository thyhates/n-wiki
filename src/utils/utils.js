/**
 * Created by thyhates on 2017/5/30.
 */
import Cookies from 'js-cookie'
import axios from 'axios'

function post({url, data}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then((res) => {
            resolve(res.data);
        }).catch((error) => {
            if (error.response) {
                reject(error.response.data);
            } else if (error.request) {
                reject({status:false,msg:'服务器未响应'});
            } else {
                reject({status:false,msg:'无法连接服务器'});
            }
        })
    })
}

let utils = {
    setCookie: Cookies.set,
    getCookie:Cookies.get,
    removeCookie:Cookies.remove,
    post:post
};
export default utils;