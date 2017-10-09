import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';

class Message extends Component{
    static navigationOptions = {
        tabBarLabel: '消息'
    };
    constructor(props){
        super();
        this.state={
            message:'holy'
        }
    }
    render(){
        return (
            <View>
                <Text>
                    消息
                </Text>
            </View>
        );
    }
}
export default Message;