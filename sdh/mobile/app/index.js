import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, Button,
    Alert, Dimensions, ScrollView, TextInput, RefreshControl,ActivityIndicator
} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import IndexHeader from './component/indexHeader';

const {width, height} = Dimensions.get('window');

class Home extends Component {

    constructor(props) {
        super();
        this.state = {
            size: {width, height: 110, backgroundColor: 'white'},
            inputValue: '',
            refreshing: false,
            scrollEvent: {},
            loading: false,
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

    _loadMore() {
        setTimeout(() => {
            this.setState({
                loading: false,
            })
        }, 2000)
    }

    _handleScroll(e) {
        if (this.state.loading) {
            return false;
        }
        let y = e.nativeEvent.contentOffset.y;
        let height = e.nativeEvent.layoutMeasurement.height;
        let contentHeight = e.nativeEvent.contentSize.height;
        if (y + height > (contentHeight - 20)) {
            this.setState({
                loading: true
            });
            this._loadMore();
        }
    }

    _handleMomentEnd(e) {
        console.log(e.type);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{height:50}}>
                <IndexHeader />
                </View>
                <ScrollView
                    onScroll={e => {
                        this._handleScroll(e)
                    }}
                    style={{flex: 1, borderWidth: 1, borderColor: 'red'}}
                    refreshControl={
                        <RefreshControl
                            tintColor="#ff0000"
                            title="加载中..."
                            titleColor="#00ff00"
                            colors={['#ff0000', '#25d1fc', '#0000ff']}
                            progressBackgroundColor="#ffffff"
                            scrollEventThrottle={50}
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this._onRefresh()
                            }}/>}>

                    <View onLayout={this._onLayoutDidChange}>
                        <Carousel style={this.state.size} autoplay={true} delay={3000} bullets={true}>
                            <View style={this.state.size}><Text style={{color: '#000000'}}>11</Text></View>
                            <View style={this.state.size}><Text style={{color: '#000000'}}>2</Text></View>
                        </Carousel>
                    </View>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consectetur dolore error
                        esse et, harum in ipsum iure iusto libero magnam nihil numquam quisquam tempora voluptatem.
                        Animi iure nihil unde.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae commodi consequuntur dolorem
                        dolores ea harum, incidunt inventore, magnam, nostrum omnis perferendis quas quisquam ratione
                        sed sunt temporibus unde. Dolor, voluptates?</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab dignissimos dolores error et
                        expedita illum ipsa iste, laboriosam molestias, nisi possimus praesentium quae quaerat repellat,
                        unde. Amet expedita laborum veritatis.</Text>
                    {
                        this.state.loading ? (<View style={{justifyContent:'center'}}><ActivityIndicator animating={this.state.loading}/></View>) : null
                    }
                </ScrollView>
            </View>
        );
    }
}

export default Home;