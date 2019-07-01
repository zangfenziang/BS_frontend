import React from 'react';
import { Form, InputNumber, Icon, Input, Button, Upload, message, Select, Modal } from 'antd';
import {url} from '../../config';

const { Option } = Select;

class NormalNewForm extends React.Component {

  state = {
    filename: '',
    file: '',
    name: '',
    type: [],
    select: 0,
    visible: false,
    loading: false,
    typename: ''
  }

  componentWillMount(){
    this.fetchType();
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.cover = this.state.filename;
        values.type = this.state.select;
        this.props.submit(values);
      }
    });
  };

  onBookNameChange = (e)=>{
    this.setState({
      name: e.target.value
    })
  }

  handleChange = (e) => {
    this.setState({
      select: e
    })
  }

  addType = () => {
    this.setState({
      visible: true,
      loading: false
    })
  }

  handleOk = () => {
    this.setState({
      loading: true
    })
    let token = localStorage.getItem('token');
    if (!token){
      token = sessionStorage.getItem('token');
    }
    const data = new URLSearchParams();
    data.append('token', token);
    data.append('typename', this.state.typename);
    fetch(url + '/type/add', {
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(json=>{
      if (json.status !== 0){
        message.error(json.message);
      }
      else{
        message.success('add success!');
        this.setState({
          visible: false,
          loading: false,
          typename: ''
        });
        this.fetchType();
      }
    })
    .catch(err=>{
      console.error(err);
      message.error(err);
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      loading: false,
      typename: ''
    })
  }

  typenameChange = (e) => {
    this.setState({
      typename: e.target.value
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const props = {
      name: 'image',
      showUploadList: false,
      action: url + '/upload',
      beforeUpload: async file=>{
        const data = new FormData();
        data.append('image', file);
        const json = await fetch(props.action, {
          method: 'POST',
          body: data
        })
        .then(res=>res.json())
        .catch(err=>{
          message.error(`${file.name} file upload failed.`);
        })
        if (json){
          if (json.status === 0){
            message.success(`${file.name} file uploaded successfully`);
            const filename = json.file;
            this.setState({
              filename: filename,
              file: file.name
            })
          }
          else{
            message.error(`${file.name} file upload failed.`);
          }
        }
        return Promise.reject(file);
      }
    };
    const typeFunc = () => {
      let str = [];
      str.push(<Option value={0} key='0'>none</Option>);
      for (let x in this.state.type){
        const type = this.state.type[x];
        str.push(<Option value={type.tid} key={type.tid}>{type.typename}</Option>);
      }
      return str;
    }
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} className="new-form">
        <Modal
          visible={this.state.visible}
          title="Type Name"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              Submit
            </Button>,
          ]}
        >
          <Input onChange={this.typenameChange} value={this.state.typename} />
        </Modal>
        <Form.Item label='Name:'>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your bookname!' }],
          })(
            <Input
              placeholder="Book Name"
              onChange={this.onBookNameChange}
            />,
          )}
        </Form.Item>
        <Form.Item label='Cover:'>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
            <div>{this.state.file}</div> 
          </Upload>
        </Form.Item>
        <Form.Item label='Origin Price:'>
          {getFieldDecorator('origin', {
            rules: [{ required: true, message: 'Please input origin price!' }],
          })(
            <InputNumber
              placeholder="Origin Price" min={0} step={0.01} precision={2}
            />,
          )}
        </Form.Item>
        <Form.Item label='Price:'>
          {getFieldDecorator('price', {
            rules: [{ required: true, message: 'Please input price!' }],
          })(
            <InputNumber
              placeholder="Price" min={0} step={0.01} precision={2}
            />,
          )}
        </Form.Item>
        <Form.Item label='Description:'>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input description!' }],
          })(
            <Input.TextArea
              placeholder="Description"
            />,
          )}
        </Form.Item>
        <Form.Item label='Type:'>
          <Select defaultValue="none" style={{ width: 120 }} onChange={this.handleChange}>
            {typeFunc()}
          </Select>
          <Button onClick={this.addType} style={{marginLeft: 10}} type="primary" shape="circle" icon="plus" />
        </Form.Item>
        <Form.Item label='link:'>
          {getFieldDecorator('link', {
            rules: [{ required: true, message: 'Please input link!' }],
            initialValue: 'http://search.dangdang.com/?key=' + this.state.name + '&act=input'
          })(
            <Input
              placeholder="Link"
            />,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            New
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

NormalNewForm.defaultProps = {
    submit: (values)=>{
        console.log(values);
    }
}

const WrappedNormalNewForm = Form.create({ name: 'normal_login' })(NormalNewForm);
export default WrappedNormalNewForm;