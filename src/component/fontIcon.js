/**
 * Created by thyhates on 2017/5/30.
 */
import React, {Component} from 'react'
export default class FaIcon extends Component {
    render() {
        return (
                <i  className={'fa '+this.props.icon} {...this.props}></i>
        )
    }
}