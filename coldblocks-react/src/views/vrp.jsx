
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';


class vrp extends Component {
  constructor() {
    super()
    this.state = {
      apiData:{},
      cName: '',
      cId: '',
      postD: 0
    }
  }
  nameChange = event => {
    console.log("Ivnoked nameChange Event handleChange: "+event.target.value);
    this.setState({ cName: event.target.value });
  }
  idChange = event => {
    console.log("Invoked idChange Event handleChange: "+event.target.value);
    this.setState({
                    cId: event.target.value });
  }
 
  handleSubmit =  async event => {
    event.preventDefault();
    
    // console.log("state "+this.state.cId);
    // console.log("state "+this.state.cName);
    const user = {
      cId: String(this.state.cId),
      cName: String(this.state.cName)
    };

    // console.log("user "+user.cId);
    // console.log("user "+user.cName);
    
    await axios.post(`http://localhost:4000/api/CreateConsumer`, 
    { headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
    { data: user})
    .then(res => {
      // console.log(res);
      console.log(".then for post"+res.data);  
    })
    .catch(function (error) {
      console.log(error);
    })    
    this.setState({postD:1},
      ()=>{
        console.log("post callback called"+this.state.postD);
      })   
  }
  componentDidMount() {
    // console.log("hi");
    fetch('http://127.0.0.1:5000/')
    .then(res => res.json())
    .then((data) => {
      console.log(data.data["0"]);
      this.setState({ apiData: data })
      console.log("state apiData:"+JSON.stringify(this.state.apiData));
      console.log("apiData"+this.state.apiData["data"]["0"])
    })
    .catch(console.log)
  }

  render() {
    const {apiData} = this.state;
    return (
      <div className="content">
          <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Vehicle Information"
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
                          label: "Number of Vehicles",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter Number of Vehicles",
                          onChange:this.idChange,
                          name: "cId"
                        },
                        {
                          label: "Vehicle Capacities",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter Vehicle Capacity",
                          onChange:this.nameChange,
                          name: "cName"
                        },
                        {
                          label: "Demands",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Enter Demands",
                          onChange:this.nameChange,
                          name: "cName"
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
                title="Route Details"
                category="Route Details"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Route</th>
                        <th>
                          Details
                        </th>
                      </tr>

                    </thead>
                    <tbody>                     
                      
                       {Array.isArray(apiData) && apiData.map(object => (
                        console.log(object),
                        <>
                        
                          <tr>
                            <td>{object["data"]}</td>
                            <td>{object["data"]}</td>
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



export default vrp;
