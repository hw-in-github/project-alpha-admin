import React  from 'react'
import { Component } from 'react'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import MenuConfig from './../../config/menuConfig'
import './index.less'
const SubMenu = Menu.SubMenu

export default class NavLeft extends Component {
    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);
        this.setState({
            menuTreeNode
        })
    }

    // 菜单渲染
    renderMenu =(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        { this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }

    render() {
        return (
            <div className="navleft-container">
                <NavLink to="/home">
                <div className="logo">
                    <img src="/assets/logo.svg" alt="" />
                    <h1>学车帮</h1>
                </div>
                </NavLink>
                <Menu className="menu" theme="dark">
                    { this.state.menuTreeNode }
                </Menu>
            </div>
        )
    }
}