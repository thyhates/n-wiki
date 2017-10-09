import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Order extends Component{
    static navigationOptions = {
        tabBarLabel: '订单'
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
                    订单
                    <Icon name="css3"/>
                </Text>
            </View>
        );
    }
}
export default Order;