import React, {Component} from 'react';
import {
    Button
} from 'react-native'
import {StackNavigator, TabNavigator, TabBarBottom,DrawerNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


import Home from '../index';
import Goods from './../container/goods';
import Order from './../container/order';
import Message from './../container/message';
import Profile from './../container/profile';
import GoodsDetail from './../container/goods/detail';
import GoodsCat from './../component/goodsCat';

const tabNavigationConfig = {
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    tabBarOptions: {
        initialRouteName: 'Index',
        tabStyle: {},
        labelStyle: {
            fontSize: 14,
        },
        style: {
            borderWidth: 0,
            borderTopColor: '#eee',
        },
        activeTintColor: '#0078d7',
        inactiveTintColor: '#888888'
    },
};
const route = TabNavigator({
    Index: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: '首页',
            tabBarIcon: ({tintColor}) => <Icon style={{fontSize: 18,color:tintColor}} name={'home'}/>
        }
    },
    Goods: {
        screen: Goods,
        navigationOptions: {
            tabBarLabel: '商品',
            tabBarIcon: ({tintColor}) => <Icon style={{fontSize: 18,color:tintColor}} name={'shopping-cart'}/>
        }
    },
    Order: {
        screen: Order,
        navigationOptions: {
            tabBarLabel: '订单', tabBarIcon: ({tintColor}) => <Icon style={{fontSize: 18,color:tintColor}} name={'list'}/>
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            tabBarLabel: '消息', tabBarIcon: ({tintColor}) => <Icon style={{fontSize: 18,color:tintColor}} name={'comment-o'}/>
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: '我的', tabBarIcon: ({tintColor}) => <Icon style={{fontSize: 18,color:tintColor}} name={'user'}/>
        }
    },
}, tabNavigationConfig);
const stateRoute = StackNavigator({
    Home: {screen: route, navigationOptions: {header: null}},
    GoodsDetail: {screen: GoodsDetail}
},{
  initialRouteName:'Home',
});


export default stateRoute;