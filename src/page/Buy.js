import React, { Component } from 'react';
import {message, Select, Card, Icon, Avatar} from 'antd';
import {origin, url} from '../config';

const { Option } = Select;
const { Meta } = Card;

class Buy extends Component{
    state = {
        book: [],
        type: [],
        show: [],
        select: 0
    }
    componentWillMount = () =>{
        this.fetchBook();
        this.fetchType();
    }

    fetchBook = () => {
        let token = localStorage.getItem('token');
        if (!token){
            token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        fetch(url + '/book/list', {
            method: 'POST',
            body: data
        })
        .then(res=>res.json())
        .then(json=>{
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 0){
                this.setState({
                    book: json.book,
                    show: json.book
                });
            }
            else{
                message.error(json.message);
            }
        })
        .catch(err=>{
            console.error(err);
        })
    }

    fetchType = async () => {
        let token = localStorage.getItem('token');
        if (!token){
          token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        const json = await fetch(url + '/type/list', {
          method: 'POST',
          body: data
        })
        .then(res=>res.json())
        .catch(err=>{
          console.error(err);
        })
        if (!json || json.status !== 0){
          message.error('please login first');
          window.location.href = '#/login';
        }
        else{
          this.setState({
            type: json.type
          })
        }
    }

    handleChange = (e) => {
        this.setState({
          select: e
        });
        let token = localStorage.getItem('token');
        if (!token){
          token = sessionStorage.getItem('token');
        }
        if (e === 0){
            this.fetchBook();
            return;
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('tid', e);
        fetch(url + '/type/search', {
            method: 'POST',
            body: data
        })
        .then(res=>res.json())
        .then(json=>{
            if (json.status === -1){
                message.error(json.message);
                window.location.href = '#/login';
            }
            else if (json.status === 0){
                const arr = json.bid;
                const vec = [];
                for (let i in arr){
                    vec.push(arr[i].bid);
                }
                const res = [];
                console.log(vec)
                for (let i in this.state.book){
                    const book = this.state.book[i];
                    console.log(book.bid)
                    for (let j in vec){
                        if (vec[j] === book.bid){
                            res.push(book);
                        }
                    }
                }
                this.setState({
                    show: res
                });
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

    pay = async (e, type) => {
        let token = localStorage.getItem('token');
        if (!token){
          token = sessionStorage.getItem('token');
        }
        const data = new URLSearchParams();
        data.append('token', token);
        data.append('bid', e);
        data.append('type', type);
        const json = await fetch(url + '/book/buy', {
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
        if (json.status === -1){
            message.error(json.message);
            window.location.href = '#/login';
        }
        else if (json.status === 0){
            message.success('buy book success!');
            this.fetchBook();
            setTimeout(() => {
                this.handleChange(this.state.select);
            }, 100);
        }
        else{
            message.error(json.message);
        }
    }

    payOnline = async (e) => {
        this.pay(e, 1);
    }

    payOffline = async (e) => {
        this.pay(e, 2);
    }

    render(){
        const typeFunc = () => {
            let str = [];
            str.push(<Option value={0} key='0'>none</Option>);
            for (let x in this.state.type){
              const type = this.state.type[x];
              str.push(<Option value={type.tid} key={type.tid}>{type.typename}</Option>);
            }
            return str;
        }
        const card = () => {
            const vec = [];
            for (let x = this.state.show.length - 1; x >= 0; --x){
                const book = this.state.show[x];
                if (book.status !== 0){
                    continue;
                }
                vec.push(
                    <Card
                        style={{ width: 300, marginTop: 16 }}
                        key={book.bid}
                        actions={[
                            <Icon type="pay-circle" onClick={()=>{this.payOnline(book.bid)}} />, 
                            <Icon type="plus" onClick={()=>{this.payOffline(book.bid)}} />, 
                            <Icon type="message" onClick={()=>{window.location.href = '#/talk/' + book.uid}} />]}
                    >
                        <Meta
                        avatar={
                            <Avatar shape="square" size="large" src={origin + '/upload/' + book.cover} />
                        }
                        title={
                        <div>
                            <a href={book.link}>{book.name}</a>
                            <del style={{marginLeft: 5}}>{book.origin_price}</del>
                            <strong style={{marginLeft: 5}}>{book.price}</strong>
                        </div>}
                        description={book.description}
                        />
                    </Card>
                )
            }
            let p = this.state.show.length % 3;
            if (p !== 0){
                p = 3 - p;
                vec.push(<div style={{width: 300, height: 0}} key={-p}></div>)
            }
            return vec;
        }
        return (
            <div>
                <Select defaultValue="none" style={{ width: 120 }} onChange={this.handleChange}>
                    {typeFunc()}
                </Select>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-around'}}>{card()}</div>
            </div>
        )
    }
}

export default Buy;