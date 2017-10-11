import React,{Component} from 'react';
import {View,Text} from 'react-native';

import Goods from "../container/goods/index";


class GoodsCat extends Component{
    constructor(){
        super();
        this.state={
            open:false
        }
    }
    render(){
        return (
            <View>
                <Text>
                    GoodsCat
                </Text>
            </View>
        )
    }
}
export default GoodsCat;
