import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, Button,
    Alert, Dimensions, ScrollView, TextInput, RefreshControl
} from 'react-native';
import Carousel from 'react-native-looped-carousel';

const {width, height} = Dimensions.get('window');

class Home extends Component {

    constructor(props) {
        super();
        this.state = {
            size: {width, height: 110},
            inputValue: '',
            refreshing: false,
            scrollEvent: {}
        };
    }

    _onLayoutDidChange = (e) => {
        const layout = e.nativeEvent.layout;
        this.setState({size: {width: layout.width, height: 110}});
    };

    _handleInputChange(value) {
        this.setState({
            inputValue: value
        })
    }

    _onRefresh() {
        this.setState({
            refreshing: true
        });
        setTimeout(() => {
            this.setState({
                refreshing: false
            })
        }, 2000);
    }

    _handleScroll(e) {
        // this.setState({
        //     scrollEvent:e
        // })
    }

    render() {
        return (
            <ScrollView onScroll={e => {
                this._handleScroll(e)
            }} style={{flex: 1, borderWidth: 1, borderColor: 'red'}}
                        refreshControl={<RefreshControl tintColor="#ff0000"
                                                        title="加载中..."
                                                        titleColor="#00ff00"
                                                        colors={['#ff0000', '#00ff00', '#0000ff']}
                                                        progressBackgroundColor="#ffffff"
                                                        scrollEventThrottle={50}
                                                        refreshing={this.state.refreshing} onRefresh={() => {
                            this._onRefresh()
                        }}/>}
            >
                <View onLayout={this._onLayoutDidChange}>
                    <Carousel style={this.state.size} autoplay={true} delay={3000} bullets={true}>
                        <View style={this.state.size}><Text style={{color: '#000000'}}>1</Text></View>
                        <View style={this.state.size}><Text style={{color: '#000000'}}>2</Text></View>
                    </Carousel>
                    <TextInput value={this.state.inputValue} onChange={value => {
                        this._handleInputChange(value)
                    }}/>
                </View>
                <Text>{JSON.stringify(this.state.scrollEvent)}</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
                <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum est magni non obcaecati ullam.
                    Adipisci alias amet consequuntur, culpa eaque est hic laboriosam, libero maxime rem, sapiente unde
                    vitae voluptatibus.</Text>
            </ScrollView>
        );
    }
}

export default Home;