import React, { Component } from 'react';
import {message} from 'antd';
import NewForm from './form/NewForm';
import {url} from '../config';

class New extends Component{
    state = {
        token: ''
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
    }
    onSubmit = async (values)=>{
        values.token = this.state.token;
        const data = new URLSearchParams();
        Object.keys(values).forEach(key=>{
          data.append(key, values[key]);
        });
        const json = await fetch(url + '/book/add', {
            method: 'POST',
            body: data,
        })
        .then(res=>res.json())
        .catch(err=>{
            console.error(err);
            message.error(err.message);
        })
        console.log(json);
        if (json){
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 1){
                message.error(json.message);
            }
            else if (json.status === 0){
                message.success('add success!');
                const bid = json.bid;
                const data = new URLSearchParams();
                if (values.type !== 0){
                    const tid = values.type;
                    data.append('bid', bid);
                    data.append('tid', tid);
                    data.append('token', this.state.token);
                    fetch(url + '/booktype/add', {
                        method: 'POST',
                        body: data
                    })
                    .catch(err=>{
                        console.error(err);
                    })
                }
            }
        }
    }
    render(){
        return (
            <div>
                <NewForm submit={this.onSubmit} />
            </div>
        )
    }
}

export default New;