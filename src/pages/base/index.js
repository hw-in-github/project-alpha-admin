import React  from 'react'
import { Component } from 'react'
import './index.less'
import { Card, Button, Form, Input,Select, Modal, Table } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import Moment from 'moment'
const FormItem = Form.Item;
const Option = Select.Option;

export default class Base extends Component {
    state = {
        list:[]
    }

    requestList = ()=>{
        let filterInfo = this.filterForm.props.form.getFieldsValue()
        axios.ajax({
            url:'/base',
            data:{
                params: {
                    cityId: filterInfo.cityId
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
                title: '序号',
                dataIndex: 'key',
                width: 60
            },
            {
                title: '城市',
                dataIndex: 'city.name',
                width: 80
            },
            {
                title: '基地名称',
                dataIndex: 'name'
            },{
                title: '基地地址',
                dataIndex: 'address'
            },{
                title: '基地交通',
                dataIndex: 'direction',
                width: 500
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
                <Card>
                    <Button type="primary" icon="plus" onClick={this.handleOpenBase}>开通基地</Button>
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
                <Modal
                    title='开通基地'
                    visible={this.state.isShowOpenBase}
                    onOk={this.handleSubmit}
                    width={800}
                    onCancel={()=>{
                        this.baseForm.props.form.resetFields();
                        this.setState({
                            isShowOpenBase:false,
                        })
                    }}
                >
                    <BaseForm wrappedComponentRef={(inst) => this.baseForm = inst }/>
                </Modal>
            </div>
        )
    }
}

class FilterForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="城市">
                    {
                        getFieldDecorator('cityId')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="5ccff59e7891d4416984c7d5">上海市</Option>
                                <Option value="5ccff5c27891d4416984c7eb">北京市</Option>
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

class BaseForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="基地名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name')(
                            <Input type="text" placeholder="请输入名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="城市" {...formItemLayout}>
                    {
                        getFieldDecorator('cityId')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="5ccff59e7891d4416984c7d5">上海市</Option>
                                <Option value="5ccff5c27891d4416984c7eb">北京市</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    {
                        getFieldDecorator('address')(
                        <Input type='text' placeholder='请输入地址' />
                    )}
                </FormItem>
                <FormItem label="基地交通" {...formItemLayout}>
                    {
                        getFieldDecorator('direction')(
                        <Input.TextArea rows={3} placeholder="请输入基地交通"/>
                    )}
                </FormItem>
            </Form>
        );
    }
}
BaseForm = Form.create({})(BaseForm);