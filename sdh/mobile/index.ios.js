/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class sdh extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={{backgroundColor: 'blue', flex: 0.3}}/>
                <View style={{backgroundColor: 'green', flex: 0.5}}/>
                <Text>Hello World</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

AppRegistry.registerComponent('sdh', () => sdh);
