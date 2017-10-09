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
    View, Button,
    Alert
} from 'react-native';
import {default as sdh} from './app/route';

export default sdh;
AppRegistry.registerComponent('sdh', () => sdh);
