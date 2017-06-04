/**
 * Created by thyhates on 2017/5/30.
 */
import React ,{Component} from 'react'
import Header from './header'
import {Route} from 'react-router-dom'
import utils from '../utils/utils'
class SubRoute extends Component{
    constructor(props){
        super(props);
        this.state={
            userName:utils.getCookie('userName')||''
        }
    }
    render(){
        return (
            <div className="content-wrapper">
                <Header logged={this.props.isLogged}  userName={this.state.userName}/>
                {this.props.routes.map((route,i)=>(
                    <Route component={route.component} key={i} path={route.path} exact={route.exact}/>
                ))
                }
            </div>
        )
    }
}
export default SubRoute;