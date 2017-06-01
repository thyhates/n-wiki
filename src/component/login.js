/**
 * Created by thyhates on 2017/5/30.
 */
import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import utils from '../utils/utils'
import auth from '../utils/auth'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: ''
        }
    }

    handleInputChange(event, value) {
        this.setState({
            [event.target.name]: value
        });
    }

    login() {
        auth.login(this.state);
    }
    componentDidUpdate(){
        console.log('app updated')
    }
    render() {

        const inputStyle = {
            marginBottom: '15px'
        };
        return (
            <div className="login-box">
                <TextField name="name" value={this.state.name} fullWidth onChange={this.handleInputChange.bind(this)}
                           floatingLabelText="用户名"
                           hintText="用户名" type="text" required
                />
                <TextField value={this.state.password} style={inputStyle} fullWidth
                           onChange={this.handleInputChange.bind(this)} floatingLabelText="密码"
                           hintText="密码" name="password" type="password" required
                />
                <RaisedButton type="submit" label="登录" onTouchTap={this.login.bind(this)} primary fullWidth/>
            </div>
        )
    }
}
export default Login;