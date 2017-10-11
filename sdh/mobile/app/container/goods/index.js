import React,{Component} from 'react';

import {View,Text,Image,Button} from 'react-native';

class Goods extends Component{
    constructor(props){
        super();
        this.state={
            message:'s'
        }
    }
    render(){
        const navigate=this.props.navigation.navigate;
        return (
            <View>
                <Text>
                    Goods View {this.state.message}.
                    <Image source={require('../../assets/img/failure.png')}/>
                </Text>
                <Button style={{width:100}} title={'detail'} onPress={()=>navigate('GoodsDetail')}/>
            </View>
        );
    }
}
export default Goods;