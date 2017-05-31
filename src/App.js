import React, {Component} from 'react';
import logo from './logo.svg';
import Notify from "react-notification-system"
import utils from './utils/utils'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Auth from './utils/auth'
import routes from './router/route'
import SubRoute from './component/subRoute'
import axios from 'axios'
//CSS
import './App.css';

axios.defaults.baseURL = 'http://nwiki.thyhates.com';
axios.defaults.headers.common['Access-Control-Allow-Origin']="*";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: true
        }
    }

    componentDidMount() {
        this.setState({
            isLogged: Auth.checkLoginState()
        });
        console.log('App has mounted...')
    }

    handleClick(event) {
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <MuiThemeProvider>
                        <SubRoute routes={routes} isLogged={this.state.isLogged}>
                        </SubRoute>

                    </MuiThemeProvider>
                </div>
            </Router>
        );
    }

}


export default App;
