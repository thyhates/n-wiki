/**
 * Created by thyhates on 2017/5/30.
 */
import React, {Component} from 'react'
import Lists from './list'
import Content from './content'

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state={
            docs:[{
                label:'first',
                description:'1',
                _id:'sdafs'
            }]
        }
    }

    render() {
        return (
            <div className="main-container">
                <Lists/>
                <Content/>
            </div>
        )
    }
}
export default MainContainer;