import React from 'react';
import { createLinks } from './actions';

const distance = 0.15;

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: {}
    };
  }

  componentDidMount() {
    const nodes = createLinks(this.props.skills);
    this.setState({
      nodes
    });
  }
  
  componentWillReceiveProps(props) {
    const nodes = createLinks(props.skills);
    this.setState({
      nodes
    });
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const radius = (height - height * distance) / 2;
   
    return (
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {this.state.nodes.children !== undefined ? (
          this.state.nodes.children.map((d, i) => {
            return (
              <g
                className='skills'
                key={i}
                transform={`rotate(${d.angle}) translate(${radius})`}
              >
                <text
                  className={d.data.selected ? 'text-selected' : ''}
                  key={i}
                  cx={d.txtPosX}
                  dy=".31em"
                  transform={`rotate(${d.textRotation}) `}
                  textAnchor={d.anchorText}
                >
                  {d.data.name}
                </text>
              </g>
            );
          })
        ) : (
          <g />
        )}
      </g>
    );
  }
}

export default Skills;
