import React, { Component } from 'react';
import RegisterForm from './form/RegisterForm';
import {message} from 'antd';
import {url} from '../config';

class Register extends Component{
    async submit(values) {
        const data = new URLSearchParams();
        Object.keys(values).forEach(key=>{
          data.append(key, values[key]);
        });
        const json = await fetch(url + '/user/register', {
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
        if (json.status === 0){
            message.success('register success!');
            window.location.href = '#/login';
        }
        else{
            message.error(json.message);
        }
    }
    render(){
        return (
            <div className='register'>
                <RegisterForm submit={this.submit} />
            </div>
        );
    }
}

export default Register;