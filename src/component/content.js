/**
 * Created by thyhates on 2017/6/4.
 */

import React,{Component} from 'react'
import Log from './log'
import {Route} from 'react-router-dom'
import ViewApi from './viewApi'
import EditApi from './editApi'
import ViewError from './viewApi'
import EditError from './editError'



class Content extends Component{
    render(){
        return(
            <div className="content-container">
                <Route path="/" exact component={Log}/>
                <Route path="/api/view/:id" component={ViewApi} exact/>
                <Route path="/api/edit/:id" component={EditApi} exact/>
                <Route path="/error/view/:id" component={ViewError} exact/>
                <Route path="/error/edit/:id" component={EditError} exact/>
            </div>
        )
    }
}
export default Content;