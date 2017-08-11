/**
 * Created by lzp on 2017/6/29.
 */

import mockjs from 'mockjs'

let mockApi=()=>{
    mockjs.mock('/hello', {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL'
        }]
    });
};
export default mockApi;