import React, {Component} from 'react';
import {
    Button
} from 'react-native'
import {StackNavigator, TabNavigator,TabBarBottom} from 'react-navigation';

import Home from '../index';
import Goods from './../container/goods';
import Order from './../container/order';
import Message from './../container/message';
import Profile from './../container/profile';

const tabNavigationConfig = {
    tabBarPosition: 'bottom',
    tabBarComponent:TabBarBottom,
    tabBarOptions:{
        initialRouteName:'goods',
        tabStyle:{
        },
        labelStyle:{
            fontSize:14,
        },
        style:{
            borderWidth:0,
            borderTopColor:'#eee',
        },
        activeTintColor:'#0078d7',
        inactiveTintColor:'#888888'
    },
};
const route = TabNavigator({
    Home: {screen: Home},
    Goods: {screen: Goods},
    Message:{screen:Message},
    Profile:{screen:Profile},
    Order:{screen:Order},
},tabNavigationConfig);
export default route;