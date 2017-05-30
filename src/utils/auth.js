/**
 * Created by thyhates on 2017/5/30.
 */
import utils from './utils'


function checkLoginState() {
    return !!utils.getCookie('token');
}

function login() {

}

function logout() {

}
let Auth={
    checkLoginState:checkLoginState,
    login:login,
    logout:logout
}
export default Auth;