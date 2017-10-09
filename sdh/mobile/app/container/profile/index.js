import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';

class Profile extends Component{
    static navigationOptions = {
        tabBarLabel: '我的'
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
                    我的
                </Text>
            </View>
        );
    }
}
export default Profile;