import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, Button,
    Alert
} from 'react-native';
import Goods from './container/goods/index'

import {default as styles} from './assets/css/style'

class Home extends Component {
    static navigationOptions = {
        tabBarLabel: '首页'
    };
    constructor(props) {
        super();
    }

    render() {
        return (
            <View>
                <Text>index view</Text>
            </View>
        );
    }
}

export default Home;