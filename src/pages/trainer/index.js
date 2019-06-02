import React  from 'react'
import { Component } from 'react'
import './index.less'
import { Card, Button, Form, Input,Select, Modal, DatePicker, InputNumber, Radio } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import ETable from '../../components/ETable/index'
import Moment from 'moment'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export default class Base extends Component {
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
        let dateInfo = this.dateForm.props.form.getFieldsValue()
        axios.ajax({
            url:'/trainer/status',
            data:{
                params: {
                    baseId: filterInfo.baseId,
                    date: dateInfo.date.format('YYYY-MM-DD')
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
            isShowOpenTrainer: true
        })
    }

    handleSchedule = (trainer) => {
        let dateInfo = this.dateForm.props.form.getFieldsValue()
        let action = trainer.status ? 'close': 'open'
        axios.ajax({
            url:`/trainer/${action}`,
            // method: 'post',
            data:{
                params: {
                    trainerId: trainer._id,
                    date: dateInfo.date.format('YYYY-MM-DD')
                }
            }
        }).then((res)=>{
            this.requestList()
        })
    }

    handleScheduleBatch = (trainers) => {
        let dateInfo = this.dateForm.props.form.getFieldsValue()
        axios.ajax({
            url:`/trainer/open/batch`,
            method: 'post',
            data:{
                params: {
                    trainerIds: trainers.map(trainer=>trainer._id).join(','),
                    date: dateInfo.date.format('YYYY-MM-DD')
                }
            }
        }).then((res)=>{
            this.requestList()
        })
    }

    handleDateChange = (date, dateString) => {
        let filterInfo = this.filterForm.props.form.getFieldsValue()
        axios.ajax({
            url:'/trainer/status',
            data:{
                params: {
                    baseId: filterInfo.baseId,
                    date: dateString
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

    handleFilter = () => {
        this.requestList();
    }
    
    handleReset = () => {
        this.filterForm.props.form.resetFields()
    }

    handleSubmit = () => {
        let trainerInfo = this.trainerForm.props.form.getFieldsValue()
        let { name, gender, baseId, age, trainingAge } = trainerInfo
        axios.ajax({
            url:'/trainer/new',
            method: 'post',
            data:{
                params: {
                    name,
                    gender,
                    baseId,
                    age,
                    trainingAge
                }
            }
        }).then((res)=>{
            this.setState({
                isShowOpenTrainer:false,
            })
            this.requestList()
        })
    }

    render() {
        let columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                width: 60
            },
            {
                title: '性别',
                dataIndex: 'gender',
                width: 60
            },
            {
                title: '基地',
                dataIndex: 'base.name',
                width: 120
            },
            {
                title: '年龄',
                dataIndex: 'age'
            },{
                title: '教龄',
                dataIndex: 'trainingAge'
            },{
                title: '创建时间',
                dataIndex: 'meta.createdAt',
                render(date){
                    let moment = Moment(date)
                    return moment.format('YYYY-MM-DD')
                }
            },{
                title: '操作',
                key: 'action',
                width: 140,
                render: (record) => {
                    return <Button type={!record.status?'primary':''} onClick={() => this.handleSchedule(record)}>
                        {record.status?'取消安排':'安排课程'}
                    </Button>
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
                <Card>

                    <Button type="primary" icon="plus" onClick={this.handleOpenBase}>创建教练</Button>
                    <DateForm wrappedComponentRef={(inst) => this.dateForm = inst } onDateChange={this.handleDateChange}/>
                    <Button disabled={this.state.selectedRowKeys&&this.state.selectedRowKeys.length?false:true} onClick={()=>this.handleScheduleBatch(this.state.selectedItem)}>安排课程</Button>
                </Card>
                <div className='content-wrap'>
                    <ETable
                        rowSelection='checkbox'
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        pagination={false}
                    />
                </div>
                <Modal
                    title='创建教练'
                    visible={this.state.isShowOpenTrainer}
                    onOk={this.handleSubmit}
                    width={800}
                    onCancel={()=>{
                        this.trainerForm.props.form.resetFields();
                        this.setState({
                            isShowOpenTrainer:false,
                        })
                    }}
                >
                    <TrainerForm bases={this.state.bases} wrappedComponentRef={(inst) => this.trainerForm = inst }/>
                </Modal>
            </div>
        )
    }
}

class DateForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY-MM-DD'
        return (
            <Form  style={{display: 'inline-block'}}>
                <FormItem style={{'marginBottom': 0}}>
                    {
                        getFieldDecorator('date',{
                            initialValue: Moment(new Date(), dateFormat)
                        })(
                            <DatePicker onChange={this.props.onDateChange} style={{margin:'0 20px'}} format={dateFormat} />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
DateForm = Form.create({})(DateForm);

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="基地">
                    {
                        getFieldDecorator('baseId')(
                            <Select
                                style={{width:160}}
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
                { this.props.children }
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);

class TrainerForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="教练姓名" {...formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓名'
                                }
                            ]
                        })(
                            <Input style={{width: 200}} type="text" placeholder="请输入姓名"/>
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        getFieldDecorator('gender')(
                        <RadioGroup>
                            <Radio value="男">男</Radio>
                            <Radio value="女">女</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="基地" {...formItemLayout}>
                    {
                        getFieldDecorator('baseId', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择基地'
                                }
                            ]
                        })(
                            <Select
                                style={{width:200}}
                            >
                            {
                                this.props.bases.map((base, i) => {
                                    return <Option value={base._id} key={i}>{base.name}</Option>
                                })
                            }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="年龄" {...formItemLayout}>
                    {
                        getFieldDecorator('age')(
                        <InputNumber style={{width:200}} min={20} max={70} defaultValue={40} />
                    )}
                </FormItem>
                <FormItem label="教龄" {...formItemLayout}>
                    {
                        getFieldDecorator('trainingAge')(
                        <InputNumber style={{width:200}} min={0} max={40} defaultValue={10} />
                    )}
                </FormItem>
            </Form>
        );
    }
}
TrainerForm = Form.create({})(TrainerForm);