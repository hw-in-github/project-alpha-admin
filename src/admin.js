import React  from 'react'
import { Component } from 'react'
import { Row, Col } from 'antd'
import Header from './components/Header'
import Footer from './components/Footer'
import NavLeft from './components/NavLeft'
import './style/common.less'

export default class Admin extends Component {

    render() {
        return (
            <div>
                <Row className="container">
                    <Col span={4} className="nav-left">
                        <NavLeft />
                    </Col>
                    <Col span={20} className="main">
                        <Header>
                            Header
                        </Header>
                        <Row className="content">
                            {this.props.children}
                        </Row>
                        <Footer>
                            Footer
                        </Footer>
                    </Col>
                </Row>
            </div>
        )
    }
}