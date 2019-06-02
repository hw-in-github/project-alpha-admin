import React  from 'react'
import { Component } from 'react'
import './index.less'
import { Card, Button, Form,Select, Table } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import Moment from 'moment'
const FormItem = Form.Item;
const Option = Select.Option;

export default class User extends Component {
    state = {
        list:[]
    }

    requestList = ()=>{
        let filterInfo = this.filterForm.props.form.getFieldsValue()
        axios.ajax({
            url:'/user',
            data:{
                params: {
                    channel: filterInfo.channel
                }
            }
        }).then((res)=>{
            let _this = this;
            this.setState({
                list:res.data.map((item,index)=>{
                    item.key=index
                    return item;
                })
            })
        })
    }

    componentDidMount(){
        this.requestList();
    }

    handleFilter = () => {
        this.requestList();
    }
    
    handleReset = () => {
        this.filterForm.props.form.resetFields()
    }

    render() {
        let columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60
            },
            {
                title: '姓名',
                dataIndex: 'username',
                width: 80
            },
            {
                title: '手机',
                dataIndex: 'phone'
            },{
                title: '渠道',
                dataIndex: 'channel'
            },{
                title: '开通时间',
                dataIndex: 'meta.createdAt',
                width: 120,
                render(date){
                    let moment = Moment(date)
                    return moment.format('YYYY-MM-DD')
                }
            }]
        return (
            <div>
                <Card>
                    <FilterForm  wrappedComponentRef={(inst) => this.filterForm = inst }>
                        <FormItem>
                        <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleFilter}>查询</Button>
                        <Button onClick={this.handleReset}>重置</Button>
                        </FormItem>
                    </FilterForm>
                </Card>
                <div className='content-wrap'>
                    <Table
                        bordered
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        pagination={false}
                    />
                </div>
            </div>
        )
    }
}

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="渠道">
                    {
                        getFieldDecorator('channel')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="ios">ios</Option>
                                <Option value="wechat">wechat</Option>
                            </Select>
                        )
                    }
                </FormItem>
                { this.props.children }
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);