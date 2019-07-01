import React, { Component } from 'react';
import {List, Input, Button, Row, Col, message, Avatar} from 'antd';
import {url} from '../config';

class Broadcast extends Component{
    state = {
        message: '',
        broadcast: []
    }
    componentWillMount(){
        this.fetchBroadcast();
    }
    fetchBroadcast = async () => {
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        fetch(url + '/broadcast/list', {
            method: 'POST',
            body: data
        })
        .then(res=>res.json())
        .then(async json=>{
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 0){
                const broadcast = json.broadcast;
                for (let i in broadcast){
                    const m = broadcast[i];
                    const uid = m.uid;
                    const data = new URLSearchParams();
                    data.append('token', token);
                    data.append('uid', uid);
                    let username = await fetch(url + '/user/find', {
                        method: 'POST',
                        body: data
                    })
                    .then(res=>res.json())
                    .then(json=>{
                        if (json.status === 0){
                            return json.user.username;
                        }
                    })
                    .catch(err=>{
                        console.error(err);
                    })
                    if (!username){
                        username = 'null'
                    }
                    m.username = username;
                }
                this.setState({
                    broadcast: broadcast.reverse()
                })
            }
            else{
                message.error(json.message);
            }
        })
        .catch(err=>{
            console.error(err);
        })
    }
    messageChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    messageSend = async () => {
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('message', this.state.message);
        const json = await fetch(url + '/broadcast/send', {
            method: 'POST',
            body: data
        })
        .then(res=>res.json())
        .catch(err=>{
            console.error(err);
            message.error(err.message);
        })
        if (!json){
            return;
        }
        if (json.status !== 0){
            message.error(json.message);
        }
        else{
            message.success('broadcast success!');
            this.setState({
                message: ''
            })
            this.fetchBroadcast();
        }
    }
    render(){
        return (
            <div>
                <Row>
                    <Col xs={20} sm={16} md={12} lg={8} xl={4}><Input value={this.state.message} onChange={this.messageChange} /></Col>
                    <Col style={{marginLeft: 5}} xs={2} sm={4} md={6} lg={8} xl={10}>
                        <Button onClick={this.messageSend}>
                            send
                        </Button>
                    </Col>
                </Row>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.broadcast}
                    renderItem={item=>(
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar style={{cursor: 'pointer'}} src="http://q1.qlogo.cn/g?b=qq&nk=751495224&s=640" onClick={()=>{window.open('#/talk/' + item.uid)}} />}
                                title={
                                    <div>
                                            <a target='_blank' rel="noopener noreferrer" href={'#/talk/' + item.uid}>
                                                {item.username}
                                            </a>
                                        </div>}
                                description={item.message}
                            />
                        </List.Item>
                    )} 
                />
            </div>
        )
    }
}

export default Broadcast;