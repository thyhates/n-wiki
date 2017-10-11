'use strict';
import React, {Component} from 'react';
import {

    View, Text,Button,Modal
} from 'react-native';

class Detail extends Component {
    static navigationOptions={
        title:'商品详情',
    };

    constructor() {
        super();
        this.state={
            modal:false
        }
    }
    _showDetailModal(){
        this.setState({
            modal:true
        });
    }
    _hideDetailModal(){
        this.setState({
            modal:false
        })
    }
    render() {
        return (
            <View>
                <Modal animationType={'slide'} transparent={true} visible={this.state.modal} onRequestClose={()=>{console.log('modal dismiss')}}>
                    <View style={{backgroundColor:'rgba(0,0,0,.5)',flex:1,justifyContent:'flex-end'}}>
                        <View style={{backgroundColor:'white',flex:0.5,}}>
                        <Text>Hello Modal</Text>
                        <Button title={'hide Modal'} onPress={()=>{this._hideDetailModal()}}/>
                        </View>
                    </View>
                </Modal>
                <Button title={'show Modal'} onPress={()=>{this._showDetailModal()}}/>
            </View>
        );
    }
}

export default Detail;