import React, { Component } from 'react';

class Tag extends Component {
  state = {
  }

  removeObject = () => {
    this.props.removeSelectedObject(this.props.object);
  }

  render() {
    return (
      <li className="tag">
        <span>{this.props.name}</span>
        <i className="fas fa-times-circle" onMouseDown={() => this.removeObject()}></i>
      </li>
    );
  }
}

export default Tag;