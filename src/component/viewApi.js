/**
 * Created by thyhates on 2017/6/4.
 */
import React, {Component} from 'react'
import data from '../dataSource/data'
import utils from  '../utils/utils'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import {Link } from 'react-router-dom'


class ViewApi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiDetails: {},
            hasComponentError:false
        }
    }
    componentDidMount() {
        this.getApiDetail();
    }
    componentDidCatch(){
        this.setState({
            hasComponentError:true
        })
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
                <h1>{this.state.apiDetails.label} </h1>
                <RaisedButton className="error-button"><Link to={"/error/view/"+this.props.match.params.did+"/"+this.state.apiDetails._id}>错误码</Link></RaisedButton>
                <Divider/>
                <p className="api-desc">{this.state.apiDetails.description}</p>
                <p className="api-update">创建人：{this.state.apiDetails.createUser} ; 最后编辑：{ this.state.apiDetails.update},时间：{new Date(this.state.apiDetails.lastTime).toLocaleString()}</p>
                <p>地址：{this.state.apiDetails.api}</p>
                <p>请求方式：{this.state.apiDetails.method}</p>
                <p>请求头(header)：</p>
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
                <p className="param-header">参数：</p>
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
                <p className="param-header">返回值：</p>
                <div className="api-header">
                    <Table selectable={false}>
                        <TableHeader displaySelectAll={false}
                                     adjustForCheckbox={false} style={headerStyle}>
                            <TableRow style={tableStyle}>
                                <TableHeaderColumn style={tableHeaderStyle}>参数</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>类型</TableHeaderColumn>
                                <TableHeaderColumn style={tableHeaderStyle}>说明</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {this.state.apiDetails.callbackParams ? this.state.apiDetails.callbackParams.map((param, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn style={tableRowStyle}>{param.key}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.type}</TableRowColumn>
                                    <TableRowColumn style={tableRowStyle}>{param.revalue}</TableRowColumn>
                                </TableRow>
                            )) : ''
                            }
                        </TableBody>
                    </Table>
                </div>
                <p>返回说明：</p>
                <p>{this.state.apiDetails.demo}</p>
            </div>
        )
    }
}

export default ViewApi;