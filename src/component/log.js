/**
 * Created by thyhates on 2017/6/4.
 */
import React, {Component} from 'react'
import Divider from 'material-ui/Divider'
import data from '../dataSource/data'
import {Link} from 'react-router-dom'

class Log extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        }
    }

    componentDidMount() {
        data.getLogs().then(res => {
            this.setState({
                logs: res.model.reverse() || []
            })
        }).catch(res => {
            this.setState({
                logs: []
            });
            console.log('get log error:', res);
        })
    }

    handleDocClick() {

    }

    render() {
        return (
            <div className="log-container">
                <h1>操作日志</h1>
                <Divider/>
                <div className="logs">
                    {
                        this.state.logs.map(log => (
                            <div className="log-item" key={log._id}>
                                <p>
                                    用户：{log.user} ;
                                    操作：{log.action} ;
                                    文档：{log.docName};
                                    {log.apiId ? log.del ? <span> 接口: {log.apiName}; </span> :
                                        <span> 接口: <Link to={'/api/view/'+log.docId+'/'+log.apiId}>{log.apiName}</Link>;</span> : ' '}
                                    时间：{log.time}
                                </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Log;