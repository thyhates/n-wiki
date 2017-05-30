/**
 * Created by thyhates on 2017/5/30.
 */
import Login from '../component/login'
import MainContainer from '../component/mainContainer'
const route = [
    {
        path: '/login',
        component: Login,
        exact:true
    }, {
        path: '/',
        component: MainContainer,
        exact:true
    }
];
export default route;