/**
 * Created by thyhates on 2017/6/4.
 */
import React, {Component} from 'react'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import data from '../dataSource/data'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.object.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, item) => {
            this.setState({
                selectedIndex: item,
            });
        };

        render() {
            return (
                <ComposedComponent
                    value={this.state.selectedIndex}
                    onChange={this.handleRequestChange}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    }
}

SelectableList = wrapState(SelectableList);

class Lists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docs: []
        }
    }


    componentDidMount() {
        this.getList();
    }

    getList() {
        data.getDocumentList().then(res => {

            res.model.forEach(item=>{
                data.getApis({
                    id:item._id
                }).then(res=>{
                    console.log('success',res);
                    item.apis=res.model||[];
                }).catch(res=>{
                    item.apis=[];
                    console.log('error',res);
                });
                this.setState({
                    docs: res.model || []
                });
            })

        }).catch(res => {
            this.setState({
                docs: []
            });
        })
    }

    render() {
        const itemStyle = {
            padding: '10px'
        };
        return (
            <div className="container-list">
                <SelectableList defaultValue={{}}>
                    <Subheader>目录</Subheader>
                    <Divider/>

                    {
                        this.state.docs.map(doc => {
                            return (
                                <ListItem innerDivStyle={itemStyle} value={{child: false, id: doc._id}}
                                          secondaryText={doc.description } primaryText={doc.label}
                                          key={doc._id}/>
                            );
                        })
                    }
                </SelectableList>
            </div>
        );
    }
}
export default Lists;