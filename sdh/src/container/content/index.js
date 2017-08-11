/**
 * Created by lzp on 2017/6/30.
 */
import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import './index.less'

import PackagePromotion from './promotion'

class Container extends Component {
    render() {
        return (
            <div className="content-wrapper">
                <Scrollbars>
                    <PackagePromotion pagination="50">
                    </PackagePromotion>
                </Scrollbars>
            </div>
        )
    }
}
export default Container;