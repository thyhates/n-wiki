/**
 * Created by thyhates on 2017/5/30.
 */
import Login from '../component/login'
import MainContainer from '../component/main'
const route = [
    {
        path: '/',
        component: MainContainer
    },
    {
        path: '/login',
        component: Login,
        exact:true
    }
];
export default route;