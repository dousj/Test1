import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  Input, Table, Tag, Tooltip, Modal, Button, Icon
} from 'antd';
import Fetch from './module/fetch'
// import Highlighter from 'react-highlight-words';
class App extends Component {
  state = {
    tableArr: null,
    visible: false,
    searchText: '',
  }
  componentWillMount() {
    this.loadDate()
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  getData(url, cb) {
    Fetch.Get(url, {
    }).then(res => {
      return res.json()
    }).then(json => {
      cb(json)
    })
  }
  loadDate() {
    let that = this
    that.getData("http://www.mocky.io/v2/5be3ced42f00006d00d9f13b", (res) => {
      console.log('ll', res)
      let data = res.apis, arr = []

      data.forEach((ele, index) => {

        arr.push({
          key: index,
          name: ele.name,
          description: ele.description,
          tags: ele.tags,
          image: ele.image,
          properties: ele.properties,
          baseURL: ele.baseURL
        })
      })
      this.setState({
        tableArr: arr
      })
      console.log('this', this.state.tableArr)
    })
  }
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div className="custom-filter-dropdown">
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      console.log('visible', this.searchInput)
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    // render: (text) => (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //     searchWords={[this.state.searchText]}
    //     autoEscape
    //     textToHighlight={text.toString()}
    //   />
    // ),
  })
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }
  search = (event) => {
    let that = this
    that.setState({
      searchText: event.target.value,
    })

    that.getData("http://www.mocky.io/v2/5be3ced42f00006d00d9f13b", (res) => {
      console.log('ll', res)
      let data = res.apis, arr = []

      data.forEach((ele, index) => {
        let tags = ele.tags
        let isExist = false;
        for (let index = 0; index < tags.length; index++) {
          console.log('aaa',tags[index])
          if (tags[index].indexOf(this.state.searchText)!= -1) {
            console.log('2222',tags[index])
            isExist = true;
            break;
          }
        }
        if (isExist) {
          arr.push({
            key: index,
            name: ele.name,
            description: ele.description,
            tags: ele.tags,
            image: ele.image,
            properties: ele.properties,
            baseURL: ele.baseURL
          })
        }

      })
      this.setState({
        tableArr: arr
      })
    })
  }
  render() {
    let pagination = false
    let columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{text}</span>,
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      className: 'resultColumns',
      render:
        (text, record) => (
          <Tooltip title={record.description}>
            <div title={record.description} className='resultColumnsDiv'>{record.description}</div>
          </Tooltip>
        ),
    },
    {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (<div className='img'><img src={record.image}></img></div>),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
        </span>
      ),
      ...this.getColumnSearchProps('tags')
    },
    {
      title: 'baseURL',
      dataIndex: 'baseURL',
      key: 'baseURL',
      render: (text, record) => (<a href={record.baseURL}>详情</a>),
    },
    {
      title: '操作',
      dataIndex: 'properties',
      key: 'properties',
      render: (text, record) => (<div>
        <Button type="primary" onClick={this.showModal}>
          弹框
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table dataSource={record.properties} columns={columns1} bordered={border} pagination={pagination} />
        </Modal>
      </div>)
      ,
    }];

    let dataSource = this.state.tableArr
    let border = true


    const columns1 = [{
      title: 'type',
      dataIndex: 'type',
      key: 'type',
    }, {
      title: 'url',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => (<a href={record.url}>详情</a>),
    },];
    return (
      <div className="App">
        <Input placeholder="Basic usage"
          value={this.state.searchText}
          onChange={this.search}
        />
        <div className="table">
          <Table dataSource={dataSource} columns={columns} bordered={border} />
        </div>


      </div>
    );
  }
}

export default App;
