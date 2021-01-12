import React from 'react';
import LegendItem from './LegendItem';
import { union } from 'components/main/general';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalClients: 0,
      totalProjects: 0,
      totalEmployees: 0,
      totalSkills: 0,
      refresh: false
    };
  }

  componentDidMount() {
    this.resetLegends(this.props);
    this.setState({totalProjects: this.props.projectsCount})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refreshLegends !== this.props.refreshLegends) this.resetLegends(this.props);
    if (!this.equal(prevProps.client, this.props.client) ||
      !this.equal(prevProps.project, this.props.project) ||
      !this.equal(prevProps.employee, this.props.employee)
      ) {
      if (this.props.client || this.props.project || this.props.employee)
        this.calculateData(this.props);
      else
        this.resetLegends(this.props);
    }
  }

  calculateData(props) {
    let { client, project, employee } = props;
    if (client) this.calculateClient(props);
    if (project) this.calculateProject(props);
    if (employee) this.calculateEmployee(props);
  }

  calculateClient({ client, projects }) {
    const brushedProjects = projects.filter(p => p.brushedDisplay);
    const totalProjects = brushedProjects.filter(p => client.projects.includes(p.id));
    const totalEmployees = [];
    const totalSkills = [];
    totalProjects.forEach(p => {
      union(totalEmployees, p.employees);
      union(totalSkills, p.skills);
    });

    this.setState({
      totalClients: 1,
      totalProjects: totalProjects.length,
      totalEmployees: totalEmployees.length,
      totalSkills: totalSkills.length
    });
  }

  calculateEmployee({ employee, clients, projects }) {
    const brushedProjects = projects.filter(project => 
      project.employees.includes(employee.id) && project.brushedDisplay);
    const brushedClientIds = brushedProjects.map(p => p.clientId);
    const totalClients = clients.filter(client => 
      client.employees.includes(employee.id) && brushedClientIds.includes(client.id)).length;
    const totalSkills = employee.skills.length;
    this.setState({
      totalClients, 
      totalProjects: brushedProjects.length,
      totalEmployees: 1,
      totalSkills
    });
  }

  calculateProject({ project }) {
    this.setState({
      totalClients: 1,
      totalProjects: 1,
      totalEmployees: project.employees.length,
      totalSkills: project.skills.length,
    });
  }

  resetLegends({ clients, projects, employees }) {
    const brushedProjects = projects.filter(p => p.brushedDisplay);
    const totalEmployees = employees.filter(e => e.brushedDisplay);
    const clientIds = brushedProjects.map(p => p.clientId);
    const totalClients = clients.filter(c => clientIds.includes(c.id)).length;
    const totalSkills = [];
    brushedProjects.forEach(p => union(totalSkills, p.skills));
    employees.forEach(e => union(totalSkills, e.skills));
    this.setState({
      totalClients,
      totalProjects: brushedProjects.length,
      totalEmployees: totalEmployees.length,
      totalSkills: totalSkills.length
    });
  }

  equal(prev, current) {
    if (prev !== current) return false;
    if (prev === current) return true;
    if (prev.id !== current.id && prev.type !== current.type) return false;
    return true;
  }

  render() {
    let {
      totalEmployees,
      totalClients,
      totalProjects,
      totalSkills,
    } = this.state;

    return (
      <div className='legend'>
        <ul>
          <LegendItem
            data={totalClients}
            type='CLIENTS'
            label='client'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
            icon='fas fa-building'
          />
          <LegendItem
            data={totalProjects}
            type='PROJECTS'
            label='project'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
            icon='fas fa-square'
          />
          <LegendItem
            data={totalEmployees}
            type='EMPLOYEES'
            label='employee'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
            icon='fas fa-user'
          />
          <LegendItem
            data={totalSkills}
            type='SKILLS'
            label='skill'
            overEvent={this.props.overEvent}
            outEvent={this.props.outEvent}
            icon='fas fa-wrench'
          />
        </ul>
      </div>
    );
  }
}

export default Legend;
