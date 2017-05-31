/**
 * Created by thyhates on 2017/5/30.
 */
import utils from './utils'
import md5 from 'blueimp-md5'
import axios from 'axios'

function checkLoginState() {
    return !!utils.getCookie('token');
}

function login({name,password}) {
    return new Promise((resolve,reject)=>{
        axios.post('/login',{
            name:name,
            password:password
        }).then((res)=>{
            resolve(res);
        }).catch((res)=>{
            reject(res);
        })
    })
}

function logout() {

}
let Auth={
    checkLoginState:checkLoginState,
    login:login,
    logout:logout
};
export default Auth;