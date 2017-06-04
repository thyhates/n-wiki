import React, {Component} from 'react';
import utils from './utils/utils'
import {BrowserRouter as Router} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Auth from './utils/auth'
import routes from './router/route'
import SubRoute from './component/sub'
import axios from 'axios'
import Snackbar from 'material-ui/Snackbar';


//CSS
import './App.css';


axios.defaults.baseURL = 'http://127.0.0.1:8089';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: true,
            snackOpenState: false,
            snackMessage: ''
        };
        utils.showMessage = message => {
            this.setState({
                snackMessage: message || '',
                snackOpenState: true
            });
        };
    }

    componentDidMount() {
        this.setState({
            isLogged: Auth.checkLoginState(),
        });
        console.log('App has mounted...');
    }

    handleClick(event) {
    }

    componentDidUpdate() {
        console.log('App updated');

    }

    render() {
        return (
            <Router ref={(router) => {
                utils.myRouter = router
            }}>
                <MuiThemeProvider>
                    <div className="App">
                        <SubRoute routes={routes} isLogged={this.state.isLogged}>
                        </SubRoute>
                        <Snackbar
                            open={this.state.snackOpenState}
                            message={this.state.snackMessage}
                            autoHideDuration={4000}
                        />
                    </div>
                </MuiThemeProvider>
            </Router>
        );
    }

}


export default App;
