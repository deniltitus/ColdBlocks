
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';


class ConsumerList extends Component {
  constructor() {
    super()
    this.state = {
      apiData:{},
      dName: '',
      dId: ''
    }
  }

  nameChange = event => {
    console.log("Ivnoked nameChange Event handleChange: "+event.target.value);
    this.setState({ dName: event.target.value });

  }
  idChange = event => {
    console.log("Invoked idChange Event handleChange: "+event.target.value);
    this.setState({
                    dId: event.target.value });

  }
 
  handleSubmit = event => {
    event.preventDefault();
    
    console.log("state "+this.state.dId);
    console.log("state "+this.state.dName);
    const user = {
      dId: String(this.state.dId),
      dName: String(this.state.dName)
    };
    console.log("user "+user.dId);
    console.log("user "+user.dName);
    
    axios.post(`http://localhost:4000/api/CreateDistribtuor`, 
    { headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',}},
    { data: user})
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    
  }
  componentDidMount() {
    // console.log("hi");
    fetch('http://localhost:4000/api/ListDistributors')
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      this.setState({ apiData: data })
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
                title="Add Distributor"
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
                          label: "Distributor ID",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Distributor ID",
                          onChange:this.idChange,
                          name: "dId"
                        },
                        {
                          label: "Name",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Distributor Name",
                          onChange:this.nameChange,
                          name: "dName"
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
                title="Distributor Details"
                category="Distributor Details with ID and Name"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Distributor ID</th>
                        <th>
                          Distributor Name
                        </th>
                      </tr>

                    </thead>
                    <tbody>                     
                      {Array.isArray(apiData) && apiData.map(object => (
                        <>
                          <tr>
                            <td>{object.distributorID}</td>
                            <td>{object.distributorName}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </Table>
                }
              />
            </Col>

            {/* <Col md={12}>
              <Card
                plain
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ConsumerList;
