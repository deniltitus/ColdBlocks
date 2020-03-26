
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import { nodeURL } from "variables/Variables.jsx";
import * as ReactBootstrap from 'react-bootstrap';
import 'remixicon/fonts/remixicon.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
class PackageList extends Component {
  constructor() {
    super()
    this.state = {
      apiData:{},
      packageDestination:'',
      packageHolder:'',
      packageId:'',
      loading:true
    }
    // this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.fHandleClose = this.fHandleClose.bind(this);
		this.state = {
      show: false,
      fShow: false
		};
  }
  destinationChange = event => {
    console.log("Ivnoked nameChange Event handleChange: "+event.target.value);
    this.setState({ packageDestination: event.target.value });
  }
  holderChange = event => {
    console.log("Ivnoked nameChange Event handleChange: "+event.target.value);
    this.setState({ packageHolder: event.target.value });
  }
  idChange = event => {
    console.log("Invoked idChange Event handleChange: "+event.target.value);
    this.setState({
                    packageId: event.target.value });
  }
 
  handleSubmit =  async event => {
    event.preventDefault();
    
    // console.log("state "+this.state.cId);
    // console.log("state "+this.state.cName);
    const user = {
      packageId: String(this.state.packageId),
      packageHolder: String(this.state.packageHolder),
      packageDestination: String(this.state.packageDestination),
      packageStatus: 1,
      packageLocation: "undefined"
    };

    // console.log("package "+package.cId);
    // console.log("package "+package.cName);
    this.setState({loading: true}, ()=>{
      console.log("loader until fetch new data")
    })

    await axios.post(nodeURL+`/api/CreateTransitPackage`, 
    { headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
    { data: user})
    .then(res => {
      // console.log(res);
      console.log(".then for post"+res.data);  
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
      console.log(error);
    })    
    this.setState({postD:1},
      ()=>{
        console.log("post callback called"+this.state.postD);
      })
  }
  fetchData(){
    fetch(nodeURL+'/api/ListPackages')
    .then(res => res.json())
    .then((data) => {
      var JSONdata = JSON.stringify(data);
      var length = data.length;
      console.log(length)
      var i = 0;
      while(i<length){
        if(data[i].status==0){
            data[i].status="Tampered";
          // console.log("inside while status: 0")          
        }
        else{
          data[i].status="Ok";
        }
        i+=1;
      }
      this.setState({loading: false, apiData: data })
      console.log(data);
    })
    .catch(console.log)
  }
  componentDidMount() {
    // console.log("hi");
    fetch(nodeURL+'/api/ListPackages')
    .then(res => res.json())
    .then((data) => {
      var JSONdata = JSON.stringify(data);
      var length = data.length;
      console.log(length)
      var i = 0;
      while(i<length){
        if(data[i].status==0){
            data[i].status="Tampered";
          // console.log("inside while status: 0")          
        }
        else{
          data[i].status="Ok";
        }
        i+=1;
      }
      this.setState({loading: false, apiData: data })
      console.log(data);
    })
    .catch(console.log)
  }
  handleClose() {
    this.setState({ show: false });
    this.fetchData();
  }
  fHandleClose() {
    this.setState({ fShow: false });
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
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
          </Modal.Footer>
      </Modal>
        <Grid fluid>
        <Row>
            <Col md={12}>
              <Card
                title="Add Package"
                content={
                  <form onSubmit={this.handleSubmit} >
                    <FormInputs 
                      ncols={["col-md-3","col-md-3", "col-md-3", "col-md-3"]}
                      properties={[
                        {
                          label: "Company (disabled)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "ColdBlocks",
                          defaultValue: "ColdBlocks",
                          disabled:true                     
                        },
                        {
                          label: "Package ID",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter Package ID",  
                          onChange:this.idChange,
                          name: "packageId",
                          required : true                    
                        },
                        {
                          label: "Destination",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter Final Destination",
                          onChange:this.destinationChange,
                          name: "packageDestination",
                          required : true
                        },
                        {
                          label: "Holder",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter First Holder",
                          onChange:this.holderChange,
                          name: "packageHolder",
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
            <Col md={12}>
              <Card
                title="Package Details"
                category="Complete Package Details"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <>
                  {/* use boolean logic for loader or data */}
                    {
                      this.state.loading ? <Loader
                      className="text-center"
                      type="Rings"
                      color="#757575"
                      height={100}
                      width={100}
                      //3 secs
          
                    /> : <Table striped hover>
                    <thead>
                      <tr>
                        <th>Package ID</th>
                        <th>
                          Package Location
                        </th>
                        <th>
                          Package Holder
                        </th>
                        <th>
                          Package Temperature
                        </th>
                        <th>
                          Package Destination
                        </th>
                        <th>
                          Package Status
                        </th>
                      </tr>

                    </thead>
                    <tbody>                     
                      {Array.isArray(apiData) && apiData.map(object => (
                        <>
                          <tr>
                            <td>{object.packageID}</td>
                            <td>{object.location}</td>
                            <td>{object.holder}</td>
                            <td>{object.temperature}</td>
                            <td>{object.destination}</td>
                            <td>{object.status}</td>
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

export default PackageList;
