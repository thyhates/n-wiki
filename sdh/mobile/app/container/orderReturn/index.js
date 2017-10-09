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
            <View>
                <Text>
                    退货
                </Text>
            </View>
        );
    }
}
export default Message;