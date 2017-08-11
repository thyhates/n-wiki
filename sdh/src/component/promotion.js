import React,{Component} from 'react';
import { Input, Radio, Row, Col, Icon} from 'antd';
const RadioGroup = Radio.Group;

class PromotionType extends Component{
    render(){
        const radioGroupStyle = {
            display: 'block'
        };
        return (
            <Row>
                <RadioGroup style={radioGroupStyle} onChange={this.props.method.handleChildActiveTypeChange}
                            value={this.props.data.childActiveType}
                            defaultValue={this.props.data.childActiveType}>
                    <Radio value="0">{this.props.data.fullStr}</Radio>
                    <Row>
                        {
                            this.props.data.childActiveType === '0' ? (
                                <Row>
                                    {
                                        this.props.data.moneyLadder.buyLadder.map((item, index) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={4}>{this.props.data.fullFirst} </Col>
                                                    <Col span={6}>
                                                        <Input value={item.min_amount} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index, true)
                                                        }}/>
                                                    </Col>
                                                    <Col span={13}>
                                                        {this.props.data.fullSecond} (<a>请选择商品</a>)
                                                        <Input value={item.amount} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index)
                                                        }} style={{width: '50px'}}/> 个
                                                    </Col>
                                                    {
                                                        item.del ? (
                                                            <Col span={1}>
                                                                <a>
                                                                    <Icon type="delete" onClick={() => {
                                                                        this.props.method.handleDeleteInterval(index)
                                                                    }}/>
                                                                </a>
                                                            </Col>
                                                        ) : ('')
                                                    }
                                                </Row>
                                            )
                                        })
                                    }
                                    {
                                        this.props.data.enableLadder ? (
                                            <Row>
                                                <a onClick={this.props.method.handleAddInterval}>
                                                    <Icon type="plus"/> 添加区间
                                                </a>
                                            </Row>
                                        ) : ''
                                    }
                                </Row>
                            ) : ''
                        }
                    </Row>
                    <Radio value="1">{this.props.data.fallStr}</Radio>
                    <Row>
                        {
                            this.props.data.childActiveType === '1' ? (
                                <Row>
                                    {
                                        this.props.data.moneyLadder.fallLadder.map((item, index) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={4}>{this.props.data.fallFirst}</Col>
                                                    <Col span={6}>
                                                        <Input value={item.min_amount} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index, true)
                                                        }}/>
                                                    </Col>
                                                    <Col span={13}>
                                                        {this.props.data.fallSecond}
                                                        <Input style={{width: '50px'}} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index)
                                                        }} value={item.price}/> 元
                                                    </Col>
                                                    {item.del ? (
                                                        <Col span={1}>
                                                            <a>
                                                                <Icon type="delete" onClick={() => {
                                                                    this.props.method.handleDeleteInterval(index)
                                                                }}/>
                                                            </a>
                                                        </Col>
                                                    ) : ('')
                                                    }
                                                </Row>
                                            )
                                        })
                                    }
                                    {
                                        this.props.data.enableLadder ? (
                                            <Row>
                                                <a onClick={this.props.method.handleAddInterval}>
                                                    <Icon type="plus"/> 添加区间
                                                </a>
                                            </Row>
                                        ) : ''
                                    }
                                </Row>
                            ) : ''
                        }
                    </Row>
                    <Radio value="2">{this.props.data.discountStr}</Radio>
                    <Row>
                        {
                            this.props.data.childActiveType === '2' ? (
                                <Row>
                                    {
                                        this.props.data.moneyLadder.discountLadder.map((item, index) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={4}>{this.props.data.discountFirst} </Col>
                                                    <Col span={6}>
                                                        <Input value={item.min_amount} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index, true)
                                                        }}/>
                                                    </Col>
                                                    <Col span={13}>
                                                        {this.props.data.discountSecond}
                                                        <Input style={{width: '50px'}} onChange={e => {
                                                            this.props.method.handleLadderInput(e, index)
                                                        }} value={item.discount}/> %
                                                    </Col>
                                                    {item.del ? (
                                                        <Col span={1}>
                                                            <a>
                                                                <Icon type="delete" onClick={() => {
                                                                    this.props.method.handleDeleteInterval(index)
                                                                }}/>
                                                            </a>
                                                        </Col>
                                                    ) : ('')
                                                    }
                                                </Row>
                                            )
                                        })
                                    }
                                    {
                                        this.props.data.enableLadder ? (
                                            <Row>
                                                <a onClick={this.props.method.handleAddInterval}>
                                                    <Icon type="plus"/> 添加区间
                                                </a>
                                            </Row>
                                        ) : ''
                                    }
                                </Row>
                            ) : ''
                        }
                    </Row>
                </RadioGroup>
            </Row>
        );
    }
}
export default PromotionType;