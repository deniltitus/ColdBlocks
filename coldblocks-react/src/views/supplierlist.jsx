
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import { nodeURL } from "variables/Variables.jsx";
import * as ReactBootstrap from 'react-bootstrap';
import 'remixicon/fonts/remixicon.css'

class SupplierList extends Component {
  constructor() {
    super()
    this.state = {
      apiData:{},
      sId:{},
      sName:{}
    }
    // this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.fHandleClose = this.fHandleClose.bind(this);
		this.state = {
      show: false,
      fShow: false
		};
  }
  
  nameChange = event => {
    console.log("Ivnoked nameChange Event handleChange: "+event.target.value);
    this.setState({ sName: event.target.value });

  }

  idChange = event => {
    console.log("Invoked idChange Event handleChange: "+event.target.value);
    this.setState({
                    sId: event.target.value });

  }
 
  handleSubmit = event => {
    event.preventDefault();
    
    // console.log("state "+this.state.sId);
    // console.log("state "+this.state.sName);

    const user = {
      sId: String(this.state.sId),
      sName: String(this.state.sName)
    };

    // console.log("user "+user.sId);
    // console.log("user "+user.sName);
    
    axios.post(nodeURL+`/api/CreateSupplier`, 
    { headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
    { data: user})
    .then(res => {
      console.log(res.data);
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
  }
  fetchData(){
    fetch(nodeURL+'/api/ListSuppliers')
    .then(res => res.json())
    .then((data) => {
      this.setState({ apiData: data })
      // console.log(data);
    })
    .catch(console.log)
  }
  componentDidMount() {
    // console.log("hi");
    fetch(nodeURL+'/api/ListSuppliers')
    .then(res => res.json())
    .then((data) => {
      this.setState({ apiData: data })
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
                title="Add Supplier"
                content={
                  <form onSubmit={this.handleSubmit} >
                    <FormInputs 
                      ncols={["col-md-5", "col-md-3", "col-md-4"]}
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
                          label: "Supplier ID",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Supplier ID",
                          onChange:this.idChange,
                          name: "sId",
                          required : true
                        },
                        {
                          label: "Name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Supplier Name",
                          onChange:this.nameChange,
                          name: "sName",
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
        </Grid>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Supplier Details"
                category="Supplier Details with ID and Name"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Supplier ID</th>
                        <th>
                          Supplier Name
                        </th>
                      </tr>

                    </thead>
                    <tbody>                     
                      {Array.isArray(apiData) && apiData.map(object => (
                        <>
                          <tr>
                            <td>{object.supplierID}</td>
                            <td>{object.supplierName}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default SupplierList;
