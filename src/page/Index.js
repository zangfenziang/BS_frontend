import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import New from './New';
import Buy from './Buy';
import Broadcast from './Broadcast';
import Message from './Message';
const { Header, Content, Footer, Sider } = Layout;

const logout = (e)=>{
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '#/login';
}

const menu = (
    <Menu onClick={logout}>
      <Menu.Item key="0">
        Logout
      </Menu.Item>
    </Menu>
);

class Index extends Component{
    state = {
        type: 0,
        token: "",
        page: '1',
        post: 0
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
        if (id !== null){
            this.setState({
                page: '4',
                post: id
            })
        }
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
            return <Broadcast />
        }
        else if (this.state.page === '4'){
            return <Message post={this.state.post} />
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
                    <Icon type="usergroup-add" />
                    <span className="nav-text">broadcast</span>
                </Menu.Item>
                <Menu.Item key="4">
                    <Icon type="message" />
                    <span className="nav-text">message</span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div style={{float: 'right', paddingRight: 20, cursor: 'pointer'}}>
                        <Dropdown overlay={menu}>
                            <Icon type="user" />
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{this.page()}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>GoBook ©2019 Created by zangfenziang</Footer>
            </Layout>
          </Layout>
        );
      }
}

export default Index;