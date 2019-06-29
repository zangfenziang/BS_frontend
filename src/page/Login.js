import React, { Component } from 'react';
import LoginFrom from './form/LoginForm';
import {message} from 'antd';
import {url} from '../config';

class Login extends Component{
    async submit(values){
        const data = new URLSearchParams();
        Object.keys(values).forEach(key=>{
          data.append(key, values[key]);
        });
        const token = await fetch(url + '/user/login', {
            method: 'POST',
            body: data,
        })
        .then(res=>res.json())
        .then(json=>{
            if (json.status === 0){
                return json.token;
            }
            else{
                message.error(json.message);
            }
        })
        .catch(err=>{
            console.error(err);
            message.error(err.message);
        })
        if (!token){
            return;
        }
        localStorage.clear();
        sessionStorage.clear();
        if (values.remember){
            localStorage.setItem('token', token);
        }
        else{
            sessionStorage.setItem('token', token);
        }
        window.location.href = '#/';
    }
    render(){
        return (
            <div className='login'>
                <LoginFrom submit={this.submit} />
            </div>
        );
    }
}

export default Login;