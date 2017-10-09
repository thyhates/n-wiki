import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';

class Goods extends Component{
    static navigationOptions = {
        tabBarLabel: '商品'
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
                    Goods View {this.state.message}.
                    <Image source={require('../../assets/img/failure.png')}/>
                </Text>
            </View>
        );
    }
}
export default Goods;