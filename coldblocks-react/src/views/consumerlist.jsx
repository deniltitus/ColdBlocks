
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import { nodeURL } from "variables/Variables.jsx";
import * as ReactBootstrap from 'react-bootstrap';
import 'remixicon/fonts/remixicon.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
class ConsumerList extends Component {
  constructor() {
    super()
    this.state = {
      apiData:{},
      cName: '',
      cId: '',
      password: '',
      postD: 0,
      fetchId: '',
      fetchName: '',
      loading:true,
      editId:'',
      editPass: ''
    }    
		this.handleClose = this.handleClose.bind(this);
		this.fHandleClose = this.fHandleClose.bind(this);
    this.fetchHandleClose = this.fetchHandleClose.bind(this);
    this.editHandleClose = this.editHandleClose.bind(this);
		this.state = {
      show: false,
      fShow: false,
      fetchShow: false,
      editShow:false
		};
  }
  
  handleChange = event => {
    const {name, value} = event.target;
    this.setState({
        [name]: value
    })
  
  }

  fetchHandleChange = event => {
    console.log("Invoked fetch ID change: "+event.target.value);
    this.setState({
            fetchId: event.target.value
    })
  }
 
  handleSubmit =  async event => {
    event.preventDefault();
    console.log("edit Id: "+this.state.editId)
    console.log(event.target.name)
    if(event.target.name=="editInfo"){
      console.log("edit details")
      const user = {
        consumerId: String(this.state.editId),
        consumerName: String(this.state.cName),
        password: String(this.state.password)
      }
      console.log("user data being sent : "+user.distributorName)
      this.setState({loading: true}, ()=>{
        console.log("loader until fetch new data")
      })
      axios.post(nodeURL+`/editConsumer/`,
      { headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
      {data : user})
      .then(res => {
        console.log(res.data);
        if(res.data=="success"){ 
          this.setState({ show: true, editShow:false }, ()=>{
          console.log("Set State for Show")
          });  
        }
        else{
          this.setState({ fShow: true }, ()=>{
            console.log("Set State for Show")
          });  
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    }
    else{
      const user = {
        cId: String(this.state.cId),
        cName: String(this.state.cName),
        password: String(this.state.password)
      };
      this.setState({loading: true}, ()=>{
        console.log("loader until fetch new data")
      })
      axios.post(nodeURL+`/api/CreateConsumer`, 
      { headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
      { data: user})
      .then(res => {
        // console.log(res);
            console.log("from node"+res.data);
            if(res.data=="success"){ 
              this.setState({ show: true }, ()=>{
              console.log("Set State for Show")
              });  
            }
            else{
              this.setState({ fShow: true }, ()=>{
                console.log("Set State for Show")
              });  
            }
      })
      .catch(function (error) {
        console.log("error from catch"+error);
      })    
      this.setState({postD:1},
        ()=>{
          console.log("post callback called"+this.state.postD);
        })   
    }
  }

  // To query wrt ID 
  fetchHandleSubmit =  async event => {
  event.preventDefault();
    const user = {
      cId: String(this.state.fetchId)
    };
    axios.get(nodeURL+`/api/ListConsumerId?cID=`+user.cId)
    .then(res => {
        // console.log(res)
        var data = res.data
        console.log(data.status);
        if(data.status=="error"){
                this.setState({
                  fShow: true
              })  
        }else{
            this.setState({
            fetchShow: true, fetchName : data.consumerName
          }) 
        }
             
    })  
  }

  fetchData(){
    fetch(nodeURL+'/api/ListConsumers')
    .then(res => res.json())
    .then((data) => {
      this.setState({ loading: false, apiData: data })
      // console.log(data);
    })
    .catch(console.log)
  }

  // for PUT request to update
  editInfo = event => {
    console.log(event.target.value)
      var splitIndex = String(event.target.value).indexOf(',')
      this.setState({
        editId: event.target.value.slice(0,splitIndex), editShow: true, editPass: event.target.value.slice(splitIndex+1)
      }, () => {console.log("editID: "+this.state.editId+" edit Pass:"+this.state.editPass)})
  }

  componentDidMount() {
    // console.log("hi");
    fetch(nodeURL+'/api/ListConsumers')
    .then(res => res.json())
    .then((data) => {
      this.setState({ loading: false,apiData: data })      
    })
    .catch(console.log)
  }
  componentDidUpdate(prevProps, prevState) {

    if (prevState.postD !== this.state.postD) {
      console.log("before new fetch"+JSON.stringify(this.state.apiData))
      console.log('postD state has changed. (inside didUpdate now)'+this.state.postD);
      axios.get(nodeURL+`/api/ListConsumers`)
      .then(res => {
        console.log(JSON.stringify(res.data))
        const fetchData = JSON.stringify(res.data);
        this.setState({
          apiData : fetchData
        })
      })
    }
  }

  handleClose() {
    this.setState({ show: false });
    this.fetchData();
	}
  fHandleClose() {
    this.setState({ fShow: false });
    this.fetchData();
	}
  fetchHandleClose() {
    this.setState({ fetchShow: false });
    this.fetchData();
  }
  editHandleClose() {
    this.setState({ editShow: false });
    this.fetchData();
	}
	// handleShow() {
	// 	this.setState({ show: true });
  // }
  
  render() {
    const {apiData} = this.state;
    var Modal = ReactBootstrap.Modal;
    return (
      <div className="content">
        <Modal show={this.state.show} onHide={this.handleClose}
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Transaction Success</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <i className="ri-emotion-laugh-line ri-10x text-success"></i>
            <p className="text-success">Transaction Was Completed Successfully</p>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.fShow} onHide={this.fHandleClose}
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Transaction Failed</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <i className="ri-emotion-unhappy-line ri-10x text-danger"></i>
            <p className="text-danger">Transaction Failed</p>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={this.fHandleClose}>
                Close
              </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.fetchShow} onHide={this.fetchHandleClose}
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Customer Found</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <i className="ri-user-search-line ri-10x text-success"></i>
            <p className="text-success"><b>Success</b></p>
            <p className="text-dark">Customer with Customer-ID <b>{this.state.fetchId}</b> found with Name <b>{this.state.fetchName}</b></p>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={this.fetchHandleClose}>
                Close
              </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.editShow} onHide={this.editHandleClose}
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Edit Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="text-center">
            <i className="ri-edit-box-line ri-5x text-dark"></i>
            <p className="text-muted">Edit Consumer Information</p>
            </Row>
            <form onSubmit={this.handleSubmit} name="editInfo" >
                      <FormInputs 
                        ncols={["col-md-4", "col-md-4", "col-md-4"]}
                        properties={[
                          {
                            label: "Consumer ID",
                            type: "text",
                            bsClass: "form-control",
                            defaultValue:this.state.editId,
                            disabled:true                          
                          },
                          {
                            label: "Name",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "Consumer Name",
                            onChange:this.handleChange,
                            name: "cName",
                            
                          },
                          {
                            label: "Password",
                            type: "password",
                            bsClass: "form-control",
                            defaultValue: this.state.editPass,
                            onChange:this.handleChange,
                            name: "password",
                            
                          }
                        ]}
                      />       
                      <div className="clearfix" />
                      <Button bsStyle="success" fill type="submit" >
                        Submit
                      </Button>
              </form>
          </Modal.Body>
        </Modal>
          <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Add Consumer"
                content={
                  <form onSubmit={this.handleSubmit} >
                    <FormInputs 
                      ncols={["col-md-3", "col-md-3", "col-md-3", "col-md-3"]}
                      properties={[
                        {
                          label: "Company (disabled)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Company",
                          defaultValue: "ColdBlocks",
                          disabled: true
                  
                        },
                        {
                          label: "Consumer ID",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Consumer ID",
                          onChange:this.handleChange,
                          name: "cId",
                          required : true
                        },
                        {
                          label: "Name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Consumer Name",
                          onChange:this.handleChange,
                          name: "cName",
                          required : true
                        },
                        {
                          label: "Password",
                          type: "password",
                          bsClass: "form-control",
                          placeholder: "Password",
                          onChange:this.handleChange,
                          name: "password",
                          required : true
                        }
                      ]}
                    />       
                    <Button bsStyle="success" pullRight fill type="submit">
                      Submit
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Card
                title="Query Consumer"
                category="Query Consumer wrt Consumer ID"
                content={
                  <form onSubmit={this.fetchHandleSubmit} >
                    <FormInputs 
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Consumer ID",
                          type: "text",
                          name: "fetchId",
                          bsClass: "form-control",
                          onChange: this.handleChange,
                          placeholder: "Enter Consumer ID",                             
                        },
                      ]}
                    />       
                    <Button bsStyle="success" pullRight fill type="submit">
                      Submit
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={8}>
              
              <Card
                title="Consumer Details"
                category="Consumer Details with ID and Name"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <>
                  {/* use boolean logic for loader or data */}
                    {this.state.loading ? <Loader
                    className="text-center"
                    type="Rings"
                    color="#757575"
                    height={100}
                    width={100}
                    //3 secs
          
                    /> : <Table striped hover>
                      <thead>
                        <tr>
                          <th>Consumer ID</th>
                          <th>
                            Consumer Name
                          </th>
                          <th className="text-center">
                            Edit
                          </th>
                        </tr>

                      </thead>
                      <tbody>                     
                        {Array.isArray(apiData) && apiData.map(object => (
                          <>
                            <tr>
                              <td>{object.consumerID}</td>
                              <td>{object.consumerName}</td>
                              <td className="text-center"><Button bsStyle="warning" bsSize="xs" value={String(object.consumerID)+String(','+object.password)} onClick={this.editInfo}>Edit</Button>{' '}</td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                    }
                  </>
                  
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ConsumerList;
