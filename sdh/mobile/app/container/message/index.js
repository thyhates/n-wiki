import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';

class Message extends Component{
    constructor(props){
        super();
        this.state={
            message:'holy'
        }
    }
    render(){
        return (
                <Text>
                    消息
                </Text>
        );
    }
}
export default Message;