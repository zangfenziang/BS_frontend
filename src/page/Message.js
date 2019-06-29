import React, { Component } from 'react';
import {List, Input, Button, message, Avatar, Select} from 'antd';
import {url} from '../config';

const {Option} = Select;

class Message extends Component{
    state = {
        uid: 0,
        message: [],
        value: '',
        select: 0,
        post: 0,
        name: 'none'
    }
    async componentWillMount(){
        this.fetchMessage();
        setInterval(()=>{
            this.fetchMessage();
        }, 1000);

        const id = this.props.post;
        if (!id){
            return;
        }
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('uid', id);
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
        if (username){
            this.setState({
                post: id,
                name: username,
                select: id
            })
        }
    }

    fetchMessage = () => {
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('mid', 0);
        fetch(url + '/message/list/', {
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then(async json => {
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 0){
                const message = json.message;
                const getUsername = async (uid) => {
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
                    return username;
                }
                for (let i in message){
                    const m = message[i];
                    m.from_username = await getUsername(m.from_uid);
                    m.to_username = await getUsername(m.to_uid);
                }
                this.setState({
                    message: message.reverse()
                })
            }
            else{
                message.error(json.message);
            }
        })
        .catch(err=>{
            console.error(err);
            message.error(err.message);
        })
    }

    selectChange = (e) => {
        this.setState({
            select: e
        })
    }

    messageChange = (e) => {
        this.setState({
            value: e.target.value
        });
    }

    messageSend = () => {
        if (this.state.select === 0){
            message.error('please select user');
            return;
        }
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('to', this.state.select);
        data.append('message', this.state.value);
        fetch(url + '/message/send', {
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 0){
                message.success('send message success!');
                this.fetchMessage();
            }
            else{
                message.error(json.message);
            }
        })
        .catch(err=>{
            console.error(err);
            message.error(err.message);
        })
    }
    
    render(){
        const option = () => {
            const vec = {};
            for (let x in this.state.message){
                const m = this.state.message[x];
                vec[m.from_uid] = m.from_username;
                vec[m.to_uid] = m.to_username;
            }
            if (this.state.post){
                vec[this.state.post] = null;
            }
            const res = [];
            for (let key in vec){
                const value = vec[key];
                if (value !== null){
                    res.push(<Option key={key} value={key}>{value}</Option>);
                }
            }
            return res;
        }
        return (
            <div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Select
                        onChange={this.selectChange}
                        defaultActiveFirstOption={true}
                        defaultValue={this.state.post}
                    >
                        <Option value={this.state.post} key={0}>{this.state.name}</Option>
                        {option()}
                    </Select>
                    <Input style={{width: '50%', marginLeft: 10}} value={this.state.value} onChange={this.messageChange} />
                    <Button style={{marginLeft: 10}} onClick={this.messageSend}>
                        send
                    </Button>
                </div>
                <List 
                    itemLayout="horizontal"
                    dataSource={this.state.message}
                    renderItem={item=>(
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={
                                        <div>
                                            <a target='_blank' rel="noopener noreferrer" href={'#/talk/' + item.from_uid}>{item.from_username}</a>->
                                            <a target='_blank' rel="noopener noreferrer" href={'#/talk/' + item.to_uid}>{item.to_username}</a>
                                        </div>
                                        }
                                description={item.message}
                            />
                        </List.Item>
                    )} 
                />
            </div>
        )
    }
}

export default Message;