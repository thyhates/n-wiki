import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Modal} from 'react-native';

class MutilSpecModal extends Component {
    constructor() {
        super();
    }

    static propTypes = {
        goodsName: PropTypes.string.isRequired,
    };

    render() {
        return (
            <View>
                {this.props.goodsName}
            </View>
        );
    }
}

export default MutilSpecModal;