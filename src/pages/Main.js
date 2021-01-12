import React from 'react';
import "../styles/main.scss"
import VizCircle from '../components/main/vizCircle/VizCircle';
import Legend from '../components/main/legend/Legend';
import Dialogue from '../components/main/dialogue/Dialogue';
import VizTimeline from '../components/main/vizTimeline/VizTimeline';
import Header from '../components/main/header/Header';
import Loader from '../components/main/loader/Loader';
import Title from '../components/main/title/Title';
import { load } from '../server/main/index';
import { getLargestClients } from '../server/main/utilities/index';
import { getObjects, union } from '../components/main/general';
import {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  getElementById,
  getDateRange,
  setHighlightText,
  unHighlightText,
  getDateFromStep,
  getMonthsDifference,
  addSelected,
  setSelectedState,
  removeSelected,
  brushObjectByDate,
  reCalculateClientHours,
  getBrushedProjectsEmployees,
  resetBrushedDisplay
} from '../components/main/interactions';
//width and height of the SVG visualization
const width = window.innerWidth;
const height = window.innerHeight;

class Main extends React.Component {
  constructor(props) {
    super(props);
    
    this._isMounted = false;
    this.state = {
      clients: [],
      unsortedClients: [],
      clickedClient: [],
      projects: [],
      employees: [],
      skills: [],
      filteredClients: [],
      filteredProjects: [],
      filteredEmployees: [],
      filteredSkills: [],
      projectsCount: [],
      size: [width, height],
      isLoading: true,
      isMobileView: false,
      dialogueIsShown: false,
      initialDates: [],
      datesBrushed: [],
      totalProjectsMonths: 0,
      elementOver: {
        type: 'none',
        info: null
      },
      dialogueInfo: {},
      displayTimeline: false,
      filterPosition: [],
      selectedObjects: [],
      selected: {
        employees: [],
        clients:[],
        category: [],
        projects: [],
        skills: [],
        annularSector: []
      },
      highlightedClient: null,
      highlightedProject: null,
      highlightedEmployee: null,
      refreshLegends: false,
      employeeClicked: false
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.setState({ isLoading: true });
    const {
      categories,
      projectList,
      employeeList,
      technologyList,
      clientList,
      unsortedClients,
      projectsCount
    } = await load();
    const selectedRange = getDateRange(projectList);
    let totalMonths = getMonthsDifference(selectedRange[0], selectedRange[1]);
    this.setState({
      initialDates: selectedRange,
      datesBrushed: selectedRange,
      totalProjectsMonths: totalMonths,
      isLoading: false,
      clients: clientList,
      unsortedClients,
      projects: projectList,
      projectsCount: projectsCount,
      employees: employeeList,
      skills: technologyList,
      filteredClients: clientList,
      filteredProjects: projectList,
      filteredEmployees: employeeList,
      filteredSkills: technologyList,
      range: selectedRange,
      clickedClient: categories,
      filterPosition: [0, totalMonths],
      annularSectors: categories.list,
      currentView: categories.name
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }


  showSkill = id => {
    const ans = highlightElementWithSkill(id, this.state.projects);
    const highlightedSectors = setHighlightElement(false, ans[0], this.state.annularSectors, false);
    const highlightedEmployees = highlightElementWithSkill(id, this.state.filteredEmployees);
    const highlightedSkills = setHighlightElement(true, [id], this.state.skills, true);

    this.setState({
      skills: highlightedSkills,
      projects: ans[1],
      annularSectors: highlightedSectors,
      filteredEmployees: highlightedEmployees
    });
  };

  showProject = id => {
    const project = getElementById(id, this.state.projects);
    const highlightedEmployees = setHighlightElement(false, project.employees, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, [id], this.state.filteredProjects, false);
    const highligtedSectors = setHighlightElement(false, [project.clientId], this.state.annularSectors, false);
    const highlightedSkills = setHighlightElement(true, project.skills, this.state.filteredSkills, true);

    this.setState({
      annularSectors: highligtedSectors,
      filteredSkills: highlightedSkills,
      filteredProjects: highlightedProjects,
      filteredEmployees: highlightedEmployees,
      highlightedProject: project
    });

    const client = getElementById(project.clientId, this.state.annularSectors);
    this.toggleDialogue();
    this.modifyDialogueInfo({ ...project, clientName: client.name, logo: client.logo }, 'PROJECT');
  };

  showEmployee = id => {

    const employee = getElementById(id, this.state.filteredEmployees);
    const brushedProjectIds = this.state.filteredProjects
    .filter(p => p.brushedDisplay && p.employees.includes(id))
    .map(p => p.id);
    const clientIds = this.state.annularSectors
      .filter(s => s.projects.filter(p => brushedProjectIds.includes(p)).length !== 0)
      .map(s => s.id);
    const highlightedEmployees = setHighlightElement(false, [id], this.state.filteredEmployees, false);
    const highlightedSectors = setHighlightElement(false, clientIds, this.state.annularSectors, false);
    const highlightedProjects = setHighlightElement(false, brushedProjectIds, this.state.filteredProjects, false);
    const highlightedSkills = setHighlightElement(true, employee.skills, this.state.filteredSkills, true);


    this.setState({
      annularSectors: highlightedSectors,
      filteredProjects: highlightedProjects,
      filteredEmployees: highlightedEmployees,
      filteredSkills: highlightedSkills,
      highlightedEmployee: employee
    });
    this.toggleDialogue();
    this.modifyDialogueInfo(employee, 'EMPLOYEE');
  };

  showClient = (id) => {
    const client = getElementById(id, this.state.annularSectors);
    let highlightedSectors = setHighlightElement(false, [id], this.state.annularSectors, false);
    highlightedSectors = client.type !== 'client' ?
      setHighlightText(true, [id], highlightedSectors, true) : highlightedSectors;
    let brushedProjects = [];
    if (client.type === 'category') {
      brushedProjects = getObjects(client.projects, this.state.projects)
    }
    else if (client.type === 'more') 
      brushedProjects = getObjects(client.projects, this.state.projects).filter(p => p.brushedDisplay);
    else  brushedProjects = this.state.filteredProjects.filter(p => p.brushedDisplay && p.clientId === id);
    const employeeIds = client.employees.filter(eId => brushedProjects.filter(p => p.employees.includes(eId)).length !== 0); 
    const highlightedEmployees = setHighlightElement(false, employeeIds, this.state.filteredEmployees, false);
    const highlightedProjects = setHighlightElement(false, client.projects, this.state.filteredProjects, false);
    const skills = [];
    brushedProjects.forEach(p => union(skills, p.skills));
    let highlightedSkills = client.type === 'client' ?
      setHighlightElement(true, skills, this.state.filteredSkills, true) :
      this.state.filteredSkills;
      // const selected = addSelected(this.state.selected, object, allObjects);
    this.setState({
      annularSectors: highlightedSectors,
      filteredSkills: highlightedSkills,
      filteredEmployees: highlightedEmployees,
      filteredProjects: highlightedProjects,
      highlightedClient: client
    });

    if (client.type === 'client') {
      this.toggleDialogue();
      this.modifyDialogueInfo(client, 'CLIENT');
    }
  };

  unHighlightElements = (annularSectors, projects, employees, skills) => {
    annularSectors = annularSectors || this.state.annularSectors;
    projects = projects || this.state.filteredProjects;
    employees = employees || this.state.filteredEmployees;
    skills = skills || this.state.filteredSkills;
    if (annularSectors.length === 17 && this.state.dialogueIsShown) this.toggleDialogue();
    else this.toggleDialogue(false);
    let unhighligtedSectors = setHighlight(true, annularSectors);
    unhighligtedSectors = unHighlightText(unhighligtedSectors);
    const unhighlightedProjects = setHighlight(true, projects);
    const unhighlightedEmployees = setHighlight(true, employees);
    const unhighlightedSkills = setHighlight(false, skills);

    this.setState({
      annularSectors: unhighligtedSectors,
      filteredSkills: unhighlightedSkills,
      filteredProjects: unhighlightedProjects,
      filteredEmployees: unhighlightedEmployees,
      highlightedClient: null,
      highlightedProject: null,
      highlightedEmployee: null
    });
  };

  toggleDialogue = (toggle = true) => {
    this.setState({ dialogueIsShown: toggle });
  };

  getProjectLogo = (id) => {
    return this.state.clients.find(p => p.projects.includes(id)).logo;
  }

  addSelectedObject = (object) => {
    const allObjects = {
      clients: this.state.clients,
      projects: this.state.projects,
      employees: this.state.employees,
      skills: this.state.skills,
    };
    const filteredObjects = {
      clients: this.state.filteredClients,
      projects: this.state.filteredProjects,
      employees: this.state.filteredEmployees,
      skills: this.state.filteredSkills,
    };
    const selected = addSelected(this.state.selected, object, allObjects);
    const selectedState = setSelectedState(selected, allObjects);
    const filteredSelectedObjects = setSelectedState(selected, filteredObjects);
    const newSelectedObject = {
      id: object.id,
      name: object.name,
      searchType: object.searchType
    };
    //add object to selectedList
    this.setState({
      selected: selected,
      selectedObjects: [...this.state.selectedObjects, newSelectedObject],
      clients: selectedState.clients,
      employees: selectedState.employees,
      projects: selectedState.projects,
      skills: selectedState.skills,
      filteredClients: filteredSelectedObjects.clients,
      filteredEmployees: filteredSelectedObjects.employees,
      filteredProjects: filteredSelectedObjects.projects,
      filteredSkills: filteredSelectedObjects.skills,
    });
  }

  removeSelectedObject = (object) => {
    const allObjects = {
      clients: this.state.clients,
      projects: this.state.projects,
      employees: this.state.employees,
      skills: this.state.skills,
    };
    const selectedObjects = this.state.selectedObjects.filter(o => o.id === object.id && o.type === object.type ? false : true);
    const selected = removeSelected(this.state.selected, object, allObjects, selectedObjects);
    const selectedState = setSelectedState(selected, allObjects);

    this.setState({
      selectedObjects: selectedObjects,
      selected: selected,
      clients: selectedState.clients,
      employees: selectedState.employees,
      projects: selectedState.projects,
      skills: selectedState.skills
    });
  }

  /**
  * Recieves an initial and ending date in number of months.  
  * Returns the range in full date object
  *
  * @param initMonth the initial number of the month in the initial full date
  * @param enMonth the ending number of the month in the end full date 
  */
  brushDates = (initMonth, enMonth) => {
    const filteredProjects = brushObjectByDate(this.state.filteredProjects, this.state.datesBrushed[0], initMonth, enMonth);
    const filteredClients = this.state.filteredClients === null ? null : reCalculateClientHours(this.state.filteredClients, filteredProjects);
    const filteredEmployees = getBrushedProjectsEmployees(filteredProjects, this.state.filteredEmployees);
    this.setState({
      refreshLegends: !this.state.refreshLegends,
      filteredProjects,
      filteredClients,
      filteredEmployees,
      filterPosition: [initMonth, enMonth]
    });
  };

  getDateFormated = (month) => {
    return getDateFromStep(month, this.state.datesBrushed[0]);
  }

  highlightElements = name => {
    let clients = this.state.filteredClients;
    let filteredEmployees = this.state.filteredEmployees;
    let filteredProjects = this.state.filteredProjects;
    let filteredSkills = this.state.filteredSkills;
    switch (name) {
      case 'EMPLOYEES':
        clients = setHighlight(false, clients);
        filteredProjects = setHighlight(false, filteredProjects);
        break;
      case 'CLIENTS':
        filteredEmployees = setHighlight(false, filteredEmployees);
        filteredProjects = setHighlight(false, filteredProjects);
        break;
      case 'PROJECTS':
        clients = setHighlight(true, clients);
        filteredEmployees = setHighlight(false, filteredEmployees);
        filteredProjects = setHighlight(true, filteredProjects);
        break;
        case 'SKILLS':
          clients = setHighlight(false, clients);
          filteredProjects = setHighlight(false, filteredProjects);
          filteredEmployees = setHighlight(false, filteredEmployees);
          filteredSkills = setHighlight(true, filteredSkills);
        break;
      default:
    }

    this.setState({
      clients,
      filteredProjects,
      filteredEmployees,
      filteredSkills
    });
  };


  modifyDialogueInfo = (data, type) => {
    this.setState({ dialogueInfo: { data, type } });
  }

  resize() {
    this.setState({ isMobileView: window.innerWidth <= 1180 });
  }

  setClickedClient(client, resetClickedClient) {
    if (resetClickedClient) return { id: '', name: '', type: '', list: [] };
    else if ((client.type === 'category' || client.type === 'more') && client.list.length === 1)
      return client.list[0];
    else return client;
  }

  containsCategory(client) {
    if (client.type === 'client') return false;
    if (client.type === 'root') return true;
    if (client.list[0].type === 'category') return true;
  }

  handleClick = (client, resetClickedClient = false) => {
    const employees = getObjects(client.employees, this.state.employees);
    const annularSectors = client.list.length === 0 ? [client] : getLargestClients(client.list);
    console.log(annularSectors)
    const clients = client.list.length === 0 ? null :
      getObjects(client.clients, this.state.unsortedClients);
    const projects = getObjects(client.projects, this.state.projects).sort((a, b) => b.hours - a.hours);
    const skillList = [];
    employees.forEach(employee => union(skillList, employee.skills));
    union(skillList, client.skills);
    const skills = client.type === 'root' ? this.state.skills :
      getObjects(skillList, this.state.skills);
    const clickedClient = this.setClickedClient(client, resetClickedClient);
    const currentView = client.type === 'more' ? client.category :
      clickedClient.id === '' ? client.name : clickedClient.name;
    const filteredProjects = brushObjectByDate(projects, this.state.datesBrushed[0], this.state.filterPosition[0], this.state.filterPosition[1]);
    const filteredEmployees = client.type === 'root' ? 
      resetBrushedDisplay(this.state.employees) : 
      getBrushedProjectsEmployees(filteredProjects, this.state.employees);
    const filteredClients = client.list.length === 0 || client.list === null ? [client] : reCalculateClientHours(clients, filteredProjects);
    const displayTimeline = this.containsCategory(client) ? false : true;
    this.setState({
      currentView,
      clickedClient,
      filteredClients,
      filteredProjects,
      filteredEmployees,
      displayTimeline,
      refreshLegends: !this.state.refreshLegends
    });
    this.unHighlightElements(annularSectors, projects, employees, skills);
  }

  render() {
    const mobileView = (
      <div className='mobile-message'>
        <div className='logo d-flex large'>
          <div className='spacing-h small' />
          <h1>FindOut Visualization</h1>
        </div>
        <div className='spacing' />
        <p>
          Please visit us from a desktop, this visualization is not
          responsive....
        </p>
      </div >
    );

    const header = <Header
      clients={this.state.clients}
      projects={this.state.projects}
      employees={this.state.employees}
      skills={this.state.skills}
      clickedClient={this.state.clickedClient}
      breadcrumbClick={this.handleClick}
      showObjectInformation={this.modifyDialogueInfo}
      toggleDialogue={this.toggleDialogue}
      addSelectedObject={this.addSelectedObject}
      selectedObjects={this.state.selectedObjects}
      removeSelectedObject={this.removeSelectedObject}
      getProjectLogo={this.getProjectLogo}

    />;
    const title = <Title
      title={this.state.currentView}
      isHighlighted={
        this.state.highlightedClient ||
        this.state.highlightedProject ||
        this.state.highlightedEmployee
      }
    />;
    const legend = <Legend
      projectsCount = {this.state.projectsCount}
      clients={this.state.filteredClients}
      projects={this.state.filteredProjects}
      employees={this.state.filteredEmployees}
      skills={this.state.filteredSkills}
      client={this.state.highlightedClient}
      project={this.state.highlightedProject}
      employee={this.state.highlightedEmployee}
      overEvent={this.highlightElements}
      outEvent={this.unHighlightElements}
      refreshLegends={this.state.refreshLegends}
    />;
    const dialogue = <Dialogue
      dialogueIsShown={this.state.dialogueIsShown}
      toggleDialogue={this.toggleDialogue}
      dialogueInfo={this.state.dialogueInfo}
    />;
    const timeline = <VizTimeline
      size={this.state.size}
      displayTimeline={this.state.displayTimeline}
      filterPosition={this.state.filterPosition}
      totalProjectsMonths={this.state.totalProjectsMonths}
      range={this.state.range}
      annularSectors={this.state.annularSectors}
      projects={this.state.filteredProjects}
      employees={this.state.filteredEmployees}
      selectProject={this.showProject}
      mouseOutProject={this.unHighlightElements}
      modifyRange={this.brushDates}
      formatDate={this.getDateFormated}
    />;
    const vizCircle = <VizCircle
      annularSectors={this.state.annularSectors}
      clients={this.state.filteredClients}
      employees={this.state.filteredEmployees}
      projects={this.state.filteredProjects}
      skills={this.state.filteredSkills}
      size={this.state.size}
      mouseOnClient={this.showClient}
      mouseOnEmployee={this.showEmployee}
      mouseOnProject={this.showProject}
      unHighlightElements={this.unHighlightElements}
      clientClick={this.handleClick}
      toggleDialogue={this.toggleDialogue}
    />;
    return (
      <React.Fragment>
        {this.state.isMobileView ? mobileView : this.state.isLoading ? <Loader /> :
          <React.Fragment>
            {header}
            {title}
            {legend}
            {dialogue}
            {vizCircle}
            {timeline}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}

export default Main;