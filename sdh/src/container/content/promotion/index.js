/**
 * Created by lzp on 2017/7/10.
 */
import React, {Component} from 'react';
import {Table} from 'antd';
import {Form, Input, Checkbox, Button, DatePicker, Radio, message} from 'antd';
import utils from '../../../utils'
import {PromotionType} from '../../../component'

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const userTypes = [
    {
        label: '全部级别',
        value: '0'
    }, {
        label: '普通',
        value: '2'
    }, {
        label: '个人代理',
        value: '3'
    }, {
        label: '县代',
        value: '4'
    }];
const activityType = [{
    label: '金额',
    value: '2'
}, {
    label: '数量',
    value: '3'
}
];
const promotionString = {
    amount: {
        ladder: {
            fullFirst: '购买数量满',
            fullSecond: ',获赠品',
            fallFirst: '购买数量≧',
            fallSecond: '促销订货价统一降至',
            discountFirst: '购买数量≧',
            discountSecond: '在原订货价基础上再打折'
        },
        normal: {
            full: '买赠',
            fall: '直降',
            discount: '打折（应付订单总额=订单金额X折扣）',
            fullFirst: '购买数量每满',
            fullSecond: ',获赠品',
            fallFirst: '购买数量满',
            fallSecond: '促销订货价统一降至',
            discountFirst: '购买数量满',
            discountSecond: '在原订货价基础上再打折'
        }
    },
    money: {
        ladder: {
            fullFirst: '单笔订货单金额≧',
            fullSecond: '￥，获赠品',
            fallFirst: '单笔订货单金额≧',
            fallSecond: '促销订货价统一降至',
            discountFirst: '单笔订货单金额≧',
            discountSecond: '在原订货价基础上再打折'
        },
        normal: {
            full: '满赠',
            fall: '满减',
            discount: '满折（促销商品应付总额=促销商品原订货总额×促销折扣）',
            fullFirst: '单笔订货单金额每满',
            fullSecond: '￥，获赠品',
            fallFirst: '单笔订货单金额每满',
            fallSecond: '元，订单金额减',
            discountFirst: '单笔订货单金额满',
            discountSecond: '元，订单金额打折'
        }
    }
};
const FULL = '0';
const FALL = '1';
const DISCOUNT = '2';

class PackagePromotion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    goods_name: '多规格测试001',
                    goods_no: '3461089',
                    goods_sku: 'white',
                    goods_price: '1',
                    key: '1'
                }, {
                    goods_name: '多规格测试001',
                    goods_no: '3461089',
                    goods_sku: 'black',
                    goods_price: '21',
                    key: '2'
                }
            ],
            columns: [
                {
                    title: '商品',
                    dataIndex: 'goods_name',
                    width: 100
                }, {
                    title: '编码',
                    dataIndex: 'goods_no',
                    width: 100
                }, {
                    title: '规格',
                    dataIndex: 'goods_sku',
                    width: 100
                }, {
                    title: '单价',
                    dataIndex: 'goods_price',
                    width: 100
                }
            ],
            form: {
                enableLadder: false,
                enableAmount: false,
                moneyLadder: {
                    buyLadder: [
                        {
                            min_amount: '',
                            goods_name: '',
                            goods_id: '',
                            amount: '',
                            del: false
                        }
                    ],
                    fallLadder: [
                        {
                            min_amount: '',
                            price: '',
                            del: false
                        }
                    ],
                    discountLadder: [
                        {
                            min_amount: '',
                            discount: '',
                            del: false
                        }
                    ]
                },
                userTypes: [],
                dateRange: [],
                activityType: '2',
                childActiveType: '0',
                name: '',
                fullFirst: promotionString.money.normal.fullFirst,
                fullSecond: promotionString.money.normal.fullSecond,
                fallFirst: promotionString.money.normal.fallFirst,
                fallSecond: promotionString.money.normal.fallSecond,
                discountFirst: promotionString.money.normal.discountFirst,
                discountSecond: promotionString.money.normal.discountSecond,
                fullStr: promotionString.money.normal.full,
                fallStr: promotionString.money.normal.fall,
                discountStr: promotionString.money.normal.discount
            },
        };
    }

    handleUserTypeChange = checkedList => {
        let form = this.state.form;
        let checked = [];
        if (checkedList.includes('0')) {
            userTypes.forEach(item => {
                item.checked = true;
                item.disabled = item.value !== '0';
                checked.push(item.value);
            });
        } else {
            checked = checkedList;
            userTypes.forEach(item => {
                item.disabled = false;
            });
        }
        form.userTypes = checked;
        this.setState({
            form
        });
    };
    handleDateRangeChange = (dates, dateStrings) => {
        let form = this.state.form;
        form.dateRange = dateStrings;
        this.setState({
            form
        });
    };
    handleActivityChange = e => {
        let form = this.state.form;
        form.activityType = e.target.value;
        form.enableAmount = e.target.value === '3';
        let typeString = 'amount';
        if (form.enableAmount) {
            typeString = 'amount';
        } else {
            typeString = 'money';
        }
        form.fullStr = promotionString[typeString].normal.full;
        form.fallStr = promotionString[typeString].normal.fall;
        form.discountStr = promotionString[typeString].normal.discount;
        this.setState({
            form
        });
        this.changePromotionString();
    };
    handleChildActiveTypeChange = e => {
        let form = this.state.form;
        form.childActiveType = e.target.value;
        this.setState({
            form
        });
    };
    changePromotionString = () => {
        let enableLadder = this.state.form.enableLadder;
        let enableAmount = this.state.form.enableAmount;
        let typeString = enableAmount ? 'amount' : 'money';
        let ladderString = enableLadder ? 'ladder' : 'normal';
        let form = this.state.form;
        Object.assign(form, promotionString[typeString][ladderString]);
        this.setState({
            form
        })
    };
    handleEnableLadderChange = e => {
        let form = this.state.form;
        form.enableLadder = e.target.checked;
        if (!form.enableLadder) {
            form.moneyLadder.buyLadder.splice(1, form.moneyLadder.buyLadder.length - 1);
            form.moneyLadder.fallLadder.splice(1, form.moneyLadder.fallLadder.length - 1);
            form.moneyLadder.discountLadder.splice(1, form.moneyLadder.discountLadder.length - 1);
        }
        this.setState({
            form
        });
        this.changePromotionString();
    };
    handleAddInterval = () => {
        if (!activityType) {
            return;
        }
        let form = this.state.form;
        let childActivityType = this.state.form.childActiveType;
        let {ladderType} = utils.getLadderType(childActivityType);
        let origin = {
            min_amount: '',
            del: true
        };
        switch (childActivityType) {
            case FULL:
                origin.goods_name = '';
                origin.goods_id = '';
                origin.amount = '';
                break;
            case FALL:
                origin.price = '';
                break;
            case DISCOUNT:
                origin.discount = '';
                break;
            default:
                break;
        }
        form.moneyLadder[ladderType].push(origin);
        this.setState({
            form
        });
    };
    handleDeleteInterval = index => {
        let childActiveType = this.state.form.childActiveType;
        let form = this.state.form;
        let {ladderType} = utils.getLadderType(childActiveType);
        form.moneyLadder[ladderType].splice(index, 1);
        this.setState({
            form
        });
    };
    handleLadderInput = (e, index, min_amount = false) => {
        let childActiveType = this.state.form.childActiveType;
        let form = this.state.form;
        let {inputType, ladderType} = utils.getLadderType(childActiveType);
        if (min_amount) {
            inputType = 'min_amount';
        }
        form.moneyLadder[ladderType][index][inputType] = e.target.value;
        this.setState({
            form
        });
    };
    handleNameChange = e => {
        let form = this.state.form;
        form.name = e.target.value;
        this.setState({
            form
        });
    };
    handleSubmitForm = () => {
        /* let params = {
             action: 'addPackagePromotion',
             params: {}
         };*/
        let form = this.state.form;
        let param = {};
        ({activityType: param.mode_type, childActiveType: param.act_type, name: param.name} = form);
        if (form.userTypes.length === 0) {
            message.warning('请选择活动用户');
            return false;
        }
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 12},
            },
        };

        return (
            <div className="content-main">
                <div className="table-wrapper">
                    <Table dataSource={this.state.data} columns={this.state.columns} pagination={false}/>
                </div>
                <div className="form-wrapper">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="活动名称"
                            hasFeedback
                        >
                            <Input placeholder="请输入活动名称" value={this.state.form.name} onChange={this.handleNameChange}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="活动用户"
                            hasFeedback
                        >
                            <CheckboxGroup options={userTypes} value={this.state.form.userTypes}
                                           onChange={this.handleUserTypeChange}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="促销时间"
                            hasFeedback
                        >
                            <RangePicker format="YYYY-MM-DD HH:mm:ss" onChange={this.handleDateRangeChange}
                                         allowClear={true} showTime={true}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="促销类型"
                            hasFeedback
                        >
                            <RadioGroup value={this.state.form.activityType} onChange={this.handleActivityChange}>
                                {activityType.map(item => (
                                    <Radio key={item.value} value={item.value}>{item.label}</Radio>))
                                }
                            </RadioGroup>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="阶梯促销"
                            hasFeedback
                        >
                            <Checkbox checked={this.state.form.enableLadder}
                                      onChange={this.handleEnableLadderChange}>启用</Checkbox>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="活动方式"
                            hasFeedback>
                            <PromotionType data={this.state.form} method={{
                                handleLadderInput: (e, index, min_amount) => {
                                    this.handleLadderInput(e, index, min_amount);
                                },
                                handleChildActiveTypeChange:(e)=>{
                                    this.handleChildActiveTypeChange(e);
                                },
                                handleDeleteInterval:index=>{
                                    this.handleDeleteInterval(index)
                                },
                                handleAddInterval:()=>{
                                    this.handleAddInterval();
                                }
                            }}>
                            </PromotionType>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" className="submit-btn" htmlType="submit" size="large"
                                    onClick={this.handleSubmitForm}>保存</Button>
                            <Button type="info" htmlType="reset" size="large">取消</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default PackagePromotion;

