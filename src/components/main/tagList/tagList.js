import React, { Component } from 'react';
import Tag from './tag';

class tagList extends Component {
  state = {}
  render() {
    const tagList = this.props.selectedObjects.map((o, i) => {
      return <Tag
        key={i}
        name={o.name}
        removeSelectedObject={this.props.removeSelectedObject}
        object={o}
      />;
    });

    return (
      <ul className='tag-list'>
        {tagList}
      </ul>
    );
  }
}

export default tagList;