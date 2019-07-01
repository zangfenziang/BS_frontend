import React, { Component } from 'react';
import { Layout, Menu, Icon, message, Button } from 'antd';
import New from './New';
import Buy from './Buy';
import Broadcast from './Broadcast';
import Message from './Message';
import Storage from './Storage';
import {url} from '../config';
const { Header, Content, Footer, Sider } = Layout;

const logout = (e)=>{
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '#/login';
}

class Index extends Component{
    state = {
        type: 0,
        token: "",
        page: '1',
        post: 0,
        username: ''
    }
    componentWillMount(){
        let token = localStorage.getItem('token');
        let type = 0;
        if (!token){
            token = sessionStorage.getItem('token');
            type = 1;
        }
        this.setState({
            type: type,
            token: token,
        })
        const id = this.props.match.params.uid;
        if (id !== undefined){
            this.setState({
                page: '4',
                post: id
            })
        }

        const data = new URLSearchParams();
        data.append('token', token);
        fetch(url + '/user/find', {
            method: 'POST',
            body: data
        })
        .then(res=>res.json())
        .then(json=>{
            if (json.status !== 0){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else{
                this.setState({
                    username: json.user.username
                })
            }
        })
    }
    onTabClick = (e)=>{
        this.setState({
            page: e.key
        });
    }
    page = ()=>{
        if (this.state.page === '1'){
            return <New />
        }
        else if (this.state.page === '2'){
            return <Buy />
        }
        else if (this.state.page === '3'){
            return <Storage />
        }
        else if (this.state.page === '4'){
            return <Message post={this.state.post} />
        }
        else if (this.state.page === '5'){
            return <Broadcast />
        }
        else{
            return 'hello'
        }
    }
    render() {
        return (
            <Layout style={{width: '100%', minHeight: '100vh'}}>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={broken => {
                this.setState({broken: broken})
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
              style={this.state.broken ? {
                height: '100vh',
                position: 'fixed',
                left: 0,
                zIndex: 10
              } : {} }
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline" onClick={this.onTabClick} defaultSelectedKeys={[this.state.page]}>
                <Menu.Item key="1">
                    <Icon type="form" />
                    <span className="nav-text">new</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="medicine-box" />
                    <span className="nav-text">buy</span>
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="carry-out" />
                    <span className="nav-text">storage</span>
                </Menu.Item>
                <Menu.Item key="4">
                    <Icon type="message" />
                    <span className="nav-text">message</span>
                </Menu.Item>
                <Menu.Item key="5">
                    <Icon type="usergroup-add" />
                    <span className="nav-text">broadcast</span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div style={{float: 'right', paddingRight: 20}}>
                        {this.state.username}
                        <Button size='small' onClick={logout} style={{marginLeft: 5}}>Logout</Button>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{this.page()}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>BookStorage ©2019 Created by Shumi</Footer>
            </Layout>
          </Layout>
        );
      }
}

export default Index;