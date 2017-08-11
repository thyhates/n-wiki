/*
 * base
 * */
import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.less';

/*
 * container
 * */
import {Header, LeftMenu, Container} from './container';
/*
 * util
 * */
import mockApi from './mock'
mockApi();
class App extends Component {
      render() {
        return (
            <Router>
                <div className="appContainer">
                    <Header/>
                    <div className="main-wrapper">
                        <LeftMenu/>
                        <Container/>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
