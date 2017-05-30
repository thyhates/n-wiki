/**
 * Created by thyhates on 2017/5/30.
 */
import React ,{Component} from 'react'
import Header from '../component/Header'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
class SubRoute extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <Header logged={this.props.isLogged} userName="thyhates"/>
                {this.props.routes.map((route,i)=>(
                    <Route component={route.component} key={i} path={route.path} exact={route.exact}/>
                ))
                }
            </div>
        )
    }
}
export default SubRoute;