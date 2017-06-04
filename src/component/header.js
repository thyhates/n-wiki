/**
 * Created by thyhates on 2017/5/30.
 */
import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu'
import Auth from '../utils/auth'
import propTypes from 'prop-types'
import {Link} from 'react-router-dom'

class Logged extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openMenu: false
        }
    }

    handleItemClick(event, child) {
        const selectedValue = child.props.value;
        if (selectedValue === '1') {
            Auth.logout();
        }
    }

    render() {
        return (
            <div>
                <IconMenu onItemTouchTap={this.handleItemClick.bind(this)}
                          iconButtonElement={<IconButton iconClassName="fa fa-user-o"/> }
                >
                    <MenuItem value="0" to="/login">
                        <i className="fa fa-user"></i>
                         {' '+this.props.userName}
                    </MenuItem>
                    <MenuItem value="1">
                        <i className="fa fa-sign-out"></i> 登出
                    </MenuItem>
                </IconMenu>
                <span>{this.props.userName}</span>
            </div>
        )
    }
}

class Login extends Component {
    render() {
        const style={
            padding:'10px',
        };
        const AStyle={
            color:'#fff',
            textDecoration:'none'
        };
        return (
            <div style={style}>
                <Link to="/login" style={AStyle}>登录</Link>
            </div>
        )
    }
}

class Header extends Component {

    render() {
        return (
            <div className="header-container">
                <AppBar title="文档管理"
                        showMenuIconButton={false}
                        iconElementRight={this.props.logged ? <Logged {...this.props} /> : <Login />}>
                </AppBar>
            </div>
        )
    }
}
Logged.propTypes = {
    userName: propTypes.string.isRequired
};
export default Header;

