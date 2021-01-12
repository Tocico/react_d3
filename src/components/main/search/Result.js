import React from 'react';
import { getIcon } from './actions';
class Result extends React.Component {

  state = {}

  mouseOverHandler = (item) => {
    if (item.searchType === 'SKILL') {
      this.props.toggleDialogue(false);
    } else if (item.searchType === 'PROJECT') {
      const logo = this.props.getProjectLogo(item.id);
      this.props.toggleDialogue();
      this.props.showObjectInformation({ ...item, clientName: item.name, logo: logo }, 'PROJECT');
    } else {
      this.props.toggleDialogue();
      this.props.showObjectInformation(item, item.searchType);
    }
  }

  removeObject = () => {
    this.props.removeSelectedObject(this.props.item);
  }

  clickHandler = (item) => {
    this.props.clickHandler(this.props.item);
    this.props.clearSearch();
  }



  render() {

    const icon = getIcon(this.props.item);
    return (
      <li
        className='result'
        key={this.props.item.name + '_' + this.props.item.id}
        onMouseOver={() => this.mouseOverHandler(this.props.item)}
        onMouseOut={() => this.props.toggleDialogue(false)}
        onMouseDown={() => this.clickHandler(this.props.item)}
      >
        <i>{icon}</i>
        {this.props.item.name}

      </li>
    );
  }
}

export default Result;