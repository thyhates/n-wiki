/**
 * Created by thyhates on 2017/5/30.
 */
import utils from './utils'

function checkLoginState() {
    return !!utils.getCookie('token');
}

function login({name, password}) {
    utils.post({
        url:'/login',
        data:{
            name:name,
            password:password
        }
    }).then(res=>{
        utils.showMessage(res.msg);
        if(res.status){
            window.location.href='/';
            utils.setCookie('token',res.token);
            utils.setCookie('userName',res.userName);
        }
    }).catch(res=>{
        utils.showMessage(res.msg);
    })
}

function logout() {
    utils.post({
        url:'/logout',
        data:{
        }
    }).then(res=>{
        utils.showMessage(res.msg);
        if(res.status){
            window.location.href='/';
            utils.removeCookie('token');
            utils.setCookie('userName');
        }
    }).catch(res=>{
        utils.showMessage(res.msg);
    })
}
let Auth = {
    checkLoginState: checkLoginState,
    login: login,
    logout: logout
};
export default Auth;