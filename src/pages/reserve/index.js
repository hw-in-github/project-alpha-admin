import React  from 'react'
import { Component } from 'react'
import './index.less'
import { Card, Button, Form, Input,Select, Modal, Table, DatePicker } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import Moment from 'moment'
import { filter } from 'rsvp';
import { functionExpression } from '@babel/types';
const FormItem = Form.Item;
const Option = Select.Option;

export default class User extends Component {
    state = {
        bases:[],
        list:[]
    }

    requestBase = ()=> {
        axios.ajax({
            url:'/base',
            data:{
            }
        }).then((res)=>{
            this.setState({
                bases: res.data
            })
        })
    }

    requestList = ()=>{
        let filterInfo = this.filterForm.props.form.getFieldsValue()
        console.log(filterInfo)
        axios.ajax({
            url:'/reserve',
            data:{
                params: {
                    baseId: filterInfo.baseId,
                    begin_time:filterInfo.begin_time?filterInfo.begin_time.unix():null,
                    end_time: filterInfo.end_time?filterInfo.end_time.unix():null,
                    status: filterInfo.status
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
        this.requestBase();
        this.requestList();
    }

    handleOpenBase = () => {
        this.setState({
            isShowOpenBase: true
        })
    }

    handleFilter = () => {
        this.requestList();
    }
    
    handleReset = () => {
        this.filterForm.props.form.resetFields()
    }

    handleSubmit = () => {
        let filterInfo = this.baseForm.props.form.getFieldsValue()
        let { cityId, name, address, direction } = filterInfo
        axios.ajax({
            url:'/base/open',
            method: 'post',
            data:{
                params: {
                    cityId,
                    name,
                    address,
                    direction
                }
            }
        }).then((res)=>{
            this.setState({
                isShowOpenBase:false,
            })
            this.requestList()
        })
    }

    render() {
        let columns = [
            {
                title: '预约日期',
                dataIndex: 'lesson.date',
                width: 120
            },
            {
                title: '预约时间',
                dataIndex: 'lesson.time',
                width: 80,
                render: function(time) {
                    return `${time}点`
                }
            },
            {
                title: '预约状态',
                dataIndex: 'lesson.status',
                render(value) {
                    let statusConfig = {
                        0: '待预约',
                        1: '已预约',
                        2: '已结束'
                    }
                    return statusConfig[value]
                }
            },{
                title: '教练姓名',
                dataIndex: 'trainer.name'
            },{
                title: '学员姓名',
                dataIndex: 'user.username'
            },{
                title: '创建时间',
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
                    <FilterForm bases={this.state.bases}  wrappedComponentRef={(inst) => this.filterForm = inst }>
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
                <FormItem label="基地">
                    {
                        getFieldDecorator('baseId')(
                            <Select
                                style={{width:140}}
                                placeholder="全部"
                            >
                                <Option value=''>全部</Option>
                                {
                                    this.props.bases.map((base, i) => {
                                        return <Option value={base._id} key={i}>{base.name}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label='预约时间'>
                    {
                        getFieldDecorator('begin_time')(
                            <DatePicker showTime={true} format='YYYY-MM-DD HH:mm:ss'/>
                        )
                    }
                </FormItem>
                <FormItem label="~" colon={false}>
                        {
                            getFieldDecorator('end_time')(
                                <DatePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                </FormItem>
                <FormItem label='预约状态'>
                        {
                            getFieldDecorator('status', {

                            })(
                                <Select
                                    style={{ width: 90 }}
                                >
                                    <Option value='0'>待预约</Option>
                                    <Option value='1'>已预约</Option>
                                    <Option value='2'>已结束</Option>
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