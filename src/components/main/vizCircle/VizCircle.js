import React from 'react';
import VizClient from './VizClient';
import VizEmployees from './VizEmployees';

//VizCircle is in charge of taking all the raw data and
//calculate with D3 how to draw the visualization in SVG
//renders the SVG visaulization
class VizCircle extends React.Component {
  render() {
    const vizClients = <VizClient
      annularSectors={this.props.annularSectors}
      clients={this.props.clients}
      projects={this.props.projects}
      size={this.props.size}
      mouseOnProject={this.props.mouseOnProject}
      mouseOutProject={this.props.unHighlightElements}
      mouseOnClient={this.props.mouseOnClient}
      mouseOutClient={this.props.unHighlightElements}
      clientClick={this.props.clientClick}
    />;
    const employees = this.props.employees.length > 0 ? < VizEmployees
      employees={this.props.employees}
      size={this.props.size}
      mouseOnEmployee={this.props.mouseOnEmployee}
      mouseOutEmployee={this.props.unHighlightElements}
      toggleDialogue={this.props.toggleDialogue}
    /> : '';
    const content =
      <svg className='circle-visualization' width={this.props.size[0]} height={this.props.size[1]}>
        {vizClients}
        {employees}
      </svg>;

    return content;
  }
}


export default VizCircle;
