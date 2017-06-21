/**
 * Created by thyhates on 2017/6/4.
 */
import React,{Component} from 'react'
import Divider from 'material-ui/Divider'
import data from '../dataSource/data'
import utils from '../utils/utils'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
class ViewError extends Component{
    constructor(props){
        super(props);
        this.state={
            docId:props.match.params.did,
            id:props.match.params.id
        }
    }
    getErrorCodeList(){
        data.getErrorCode({id:this.state.docId}).then(res=>{
            console.log(res,'res')
            this.setState({
                errorList: res.documentInfo[0].errorCodeLst
            })
        }).catch(res => {
            utils.showMessage(res.msg)
        })
    }
    componentDidMount(){
        this.getErrorCodeList();
    }
    render(){
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
            <div className="view-error">
                <h1>错误码</h1>
                <Divider/>
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false}
                                 adjustForCheckbox={false} style={headerStyle}>
                        <TableRow style={tableStyle}>
                            <TableHeaderColumn style={tableHeaderStyle}>错误码</TableHeaderColumn>
                            <TableHeaderColumn style={tableHeaderStyle}>错误码返回</TableHeaderColumn>
                            <TableHeaderColumn style={tableHeaderStyle}>说明</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.errorList? this.state.errorList.map((param, i) => (
                            <TableRow key={i}>
                                <TableRowColumn style={tableRowStyle}>{param.name}</TableRowColumn>
                                <TableRowColumn style={tableRowStyle}>{param.res}</TableRowColumn>
                                <TableRowColumn style={tableRowStyle}>{param.description}</TableRowColumn>
                            </TableRow>
                        )) : ''
                        }
                    </TableBody>
                </Table>
            </div>
        )
    }
}
export default ViewError;