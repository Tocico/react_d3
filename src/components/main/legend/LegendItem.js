import React from 'react';

class LegendItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 0,
      text: ''
    };
  }

  componentDidMount() {
    this.setState({
      type: this.props.type,
      text: this.setText(this.props.data, this.props.label)
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) 
      this.setState({
        text: this.setText(this.props.data, this.props.label)
      });
  }

  setText(data, label) {
    let text = `${data} ${label}`;
    if (data !== 1) 
      if (label.charAt(label.length - 1) === 's') text += '\'';
      else text += 's'; 
    return text;
  } 


  render() {
    return (
      <li className='legend-item'>
        <div
          role="menuitem"
          className={'thing'}
          onMouseEnter={() => this.props.overEvent(this.props.type)}
          onMouseLeave={() => this.props.outEvent()}
        >
          <i className={this.props.icon}/>
          {this.state.text}
        </div>
      </li>
    );
  }
}

export default LegendItem;