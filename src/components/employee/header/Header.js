import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    const { history } = this.props;
    return (
      <div>
        <Button className="backBtn" onClick={()=> history.goBack()} >
          <i className="fas fa-angle-double-left"></i>Back
        </Button>
        <Navbar className="header" variant="header" expand="lg">
          <div className="h-row">
            <img
              src="../img/logos/FindOut.png"
              alt="FindOut"
              className="brandLogo"
            />
          </div>
        </Navbar>
      </div>
    );
  }
}

export default Header;
