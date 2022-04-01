import React from 'react';
// import './app.css';
import { Button,Modal} from 'react-bootstrap';

class ModalCluster extends React.Component {
  constructor(props){
    super(props);
    this.state={
      show:false
    }
  }
  handleModal(){
    this.setState({show:!this.state.show})
  }
  render(){
    return (
      <div>
        <h2 align='center'>Example of Modal in Reactjs</h2>
        <div className="modalClass">
          <Button onClick={()=>this.handleModal()}>Click To Open Modal</Button>
        </div>

        <Modal show={this.state.show} onHide={()=>this.handleModal()}>
          <Modal.Header closeButton>This is a Modal Heading</Modal.Header>
          <Modal.Body>This is a Modal Body</Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>this.handleModal()}>Close</Button>
            <Button onClick={()=>this.handleModal()}>Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
export default ModalCluster;