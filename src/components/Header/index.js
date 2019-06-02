import React  from 'react'
import { Component } from 'react'
import { Row, Col } from 'antd'
import Utils from '../../utils/utils'
import './index.less'

export default class Header extends Component {
    componentWillMount() {
        this.setState({
            userName: "admin"
        })
        setInterval(()=>{
            let sysTime = Utils.formateDate(new Date().getTime())
            this.setState({
                sysTime
            })
        }, 1000)
    }

    render() {
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a href="#">退出</a>
                    </Col>
                </Row>
                <Row className="breadcrumb">
                    <Col span={4} className="breadcrumb-title">
                        
                    </Col>
                    <Col span={20} className="weather">
                        <span className="date">{this.state.sysTime}</span>
                        <span className="weather-detail">晴转多云</span>
                    </Col>
                </Row>
            </div>
        )
    }
}