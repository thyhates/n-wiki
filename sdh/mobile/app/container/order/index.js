import React,{Component} from 'react';

import {View,Text,Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Order extends Component{
    constructor(props){
        super();
        this.state={
            message:'holy'
        }
    }
    render(){
        return (
                <Text>
                    订单
                    <Icon name="css3"/>
                </Text>
        );
    }
}
export default Order;