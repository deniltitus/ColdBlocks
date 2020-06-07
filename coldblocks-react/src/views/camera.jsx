import React from "react";
import {
  Grid,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import QrReader from 'react-qr-reader';
import QRCode from "qrcode.react"
import { style } from "variables/Variables.jsx";
import NotificationSystem from "react-notification-system";
import axios from "axios";
import {reactURl, nodeURL} from "../variables/Variables"
class ColdAR extends React.Component {
  constructor(){
    super();
    this.state = {
      result: '',
      show: false,
      _notificationSystem: null,
      pId: '',      
    }
    this.handleClose = this.handleClose.bind(this);
  }
  
  // handleScan = (data) => {
  //   if(data=="success")
  //   {this.setState({
  //     show: true
  //   })}
  // }
  handleScan = data => {
    if (data) {
      this.setState({
        result: data
      }, () =>
        {
            console.log(this.state.result)
            this.setState({ _notificationSystem: this.refs.notificationSystem })
            var _notificationSystem = this.refs.notificationSystem;
            var level = "success"
            _notificationSystem.addNotification({
              title: <span data-notify="icon" className="ri-error-warning-fill" />,
              message: (
                <div>
                  QR-Code Scanned. Press submit to continue !
                </div>
              ),
              level: level,
              position: "bl",
              autoDismiss: 15
            });
        }
      )
    }
  }
  handleError = err => {
    console.error(err)
  }
  handleSubmit = event => {
    event.preventDefault()
    axios.get(String(this.state.result+'&userId='+localStorage.getItem('username')))
    // axios.get('http://localhost:4000/qrHolderChange?packageID=H010')
    .then(res => {
        // console.log(res)
        var data = res.data
        console.log(data)        
        this.setState({
          show: true
        })
    }) 
  }
  handleClose() {
    this.setState({ show: false });    
  }
  idChange = event => {
    console.log("Invoked idChange Event handleChange: "+event.target.value);
    this.setState({
                    pId: event.target.value });
  }
  downloadQR = () => {
    const canvas = document.getElementById("123456");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    var fileName = String(localStorage.getItem('username')+String("-"+this.state.pId)) + String('--'+Math.floor(Math.random() * 101));
    downloadLink.download = fileName+".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  componentDidMount(){
    // this.setState({ _notificationSystem: this.refs.notificationSystem });        
  }
  render() {
    return (
      <div className="content">        
      <NotificationSystem ref="notificationSystem" style={style} />
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
            <p className="text-success">Holder Change was Completed Successfully</p>
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
                category="Generate QR-Code for HolderChange Event. Download and Print the QR-Code on the Package. QR-Code changes dynamically on input of Package-ID"
                content={
                  <>   
                    <form onSubmit={this.handleSubmit} name="editInfo" >
                      <FormInputs 
                        ncols={["col-md-6", "col-md-6"]}
                        properties={[
                          {
                            label: "Company",
                            type: "text",
                            disabled: true,
                            defaultValue : "ColdBlocks",
                            bsClass: "form-control",                                                               
                          },
                          {
                            label: "Package ID",
                            type: "text",
                            bsClass: "form-control",
                            placeholder: "Package ID",
                            onChange:this.idChange,
                            name: "packageId",                            
                          },
                        ]}
                        />       
                        <div className="clearfix" />
                        {/* <Button bsStyle="success" fill type="submit" >
                          Submit
                        </Button> */}
                    </form>
                    <hr />
                    <div  className="text-center">
                      <QRCode
                        id="123456"
                        value={nodeURL+"/qrHolderChange?packageID="+this.state.pId}
                        size={290}
                        level={"H"}
                        includeMargin={true}
                      /> <br />
                      <Button bsStyle="success" fill onClick={this.downloadQR}>
                          Download QR
                      </Button>                                                  
                    </div>                             
                </>
                }
              />
          </Col>
        </Row>
          <Row>
            <Col md={12}>
              <Card
                  category="ColdAR is an Augmented Reality enabled QR Scanner that allows a user to scan a product QR code to verify its status. A status -ok- means that the package is not tampered, else it's tampered."
                  content={
                    <>
                      {/* // <Button  pullRight bsStyle="primary" href="https://coldblocksar.netlify.com" target="_blank">Launch ColdAR</Button> */}
                      <QrReader
                      delay={300}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '100%'}}
                    />
                    <br />
                    
                    {/* <p className="text-muted text-center">{this.state.result}</p>                     */}
                      <Button bsStyle="success" pullRight fill onClick={this.handleSubmit} style={{cursor: "pointer",zIndex:"100"}}>
                            Submit
                      </Button>                      
                    <br />
                  </>
                  }
                />
            </Col>
          </Row>
      </Grid>
    </div>          
    )
  }
}

export default ColdAR;