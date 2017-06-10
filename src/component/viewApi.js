/**
 * Created by thyhates on 2017/6/4.
 */
import React, {Component} from 'react'
import data from '../dataSource/data'
import utils from  '../utils/utils'
import Divider from 'material-ui/Divider'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
class ViewApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiDetails: {}
        }
    }

    componentDidMount() {
        this.getApiDetail();
    }

    componentDidUpdate() {
    }

    getApiDetail() {
        data.getApiDetail({id: this.props.match.params.id})
            .then(res => {
                this.setState({
                    apiDetails: res.model[0]
                })
            }).catch(res => {
            utils.showMessage(res.msg)
        })
    }

    render() {
        const headerStyle={
            background:'#eee',
            border:'none'
        };
        const tableStyle={
            border:'none'
        };
        const tableHeaderStyle={
            height:'30px'
        };
        const tableRowStyle={
            borderBottom:'1px solid #eee'
        };
        return (
            <div className="view-api">
                <h1>{this.state.apiDetails.label}</h1>
                <Divider/>
                <p className="api-desc">{this.state.apiDetails.description}</p>
                <p>请求头：</p>
                <div className="api-header">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false} style={headerStyle}>
                            <TableRow style={tableStyle}>
                                <TableHeaderColumn style={tableHeaderStyle}>参数</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>必填</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>说明</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {this.state.apiDetails.params ? this.state.apiDetails.params.map((param, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn style={tableRowStyle}>{param.apiName}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.require}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.apiValue}</TableRowColumn>
                                </TableRow>
                            )) : ''
                            }
                        </TableBody>
                    </Table>
                </div>
                <p className="param-header">请求参数：</p>
                <div className="api-header">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false} style={headerStyle}>
                            <TableRow style={tableStyle}>
                                <TableHeaderColumn style={tableHeaderStyle}>参数</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>必填</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>类型</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>说明</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {this.state.apiDetails.res ? this.state.apiDetails.res.map((param, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn style={tableRowStyle}>{param.key}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.require}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.type}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.revalue}</TableRowColumn>
                                </TableRow>
                            )) : ''
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }
}
export default ViewApi;