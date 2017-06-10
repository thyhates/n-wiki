/**
 * Created by thyhates on 2017/5/30.
 */
import React, {Component} from 'react'
import Header from './header'
import {Route, Switch} from 'react-router-dom'
import utils from '../utils/utils'
import Login from '../component/login'
import MainContainer from '../component/main'
class SubRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: utils.getCookie('userName') || ''
        }
    }

    render() {
        return (
            <div className="content-wrapper">
                <Header logged={this.props.isLogged} userName={this.state.userName}/>
                <Switch>
                    <Route component={Login} path='/login' exact strict/>
                    <Route component={MainContainer} path='/' strict/>
                </Switch>
            </div>
        )
    }
}
export default SubRoute;