import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { profileImageGetter } from '../../../server/employee/utilities/index';

export default class Profile extends Component {
  //Return dummy image when there is no server-side image
  addDefaultSrc(ev){
    ev.target.src = `${process.env.PUBLIC_URL}/img/employees/employee_placeholder.jpg`;
  }

  render() {
    const {firstName, lastName, location, role, description } = this.props.profile;

    const image = profileImageGetter({ firstName, lastName });

    return (
      <Container className="profile">
        <Row>
          <Col>
            <img src={image} onError={this.addDefaultSrc} alt={`${firstName} ${lastName}`} />
          </Col>
          <Col>
            <Row>
              <h1>{firstName} {lastName}</h1>
            </Row>
            <Row>
              <h4>{role}</h4>
            </Row>
            <Row>
              <h5>Location: {location}</h5>
            </Row>
          </Col>
          
        </Row>
            <div className="description">{description}</div>
      </Container>
    );
  }
}
