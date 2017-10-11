import React, {Component} from 'react';
import {View, Button, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const headerStyle = StyleSheet.create({
    header: {
        height: 44,
        backgroundColor: '#0078d7',
        flex: 1,
        top:0
    }
});

class IndexHeader extends Component {
    constructor(props) {
        super();
        this.state = {}
    }

    render() {
        return (
            <View style={headerStyle.header}>
                <Text>header</Text>
            </View>
        );
    }
}

export default IndexHeader;
