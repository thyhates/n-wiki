import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';

class Profile extends Component{
    constructor(props){
        super();
        this.state={
            message:'holy'
        }
    }
    render(){
        return (
                <Text>
                    我的
                </Text>
        );
    }
}
export default Profile;