import moment from 'moment';
import { union } from 'components/main/general';
import {
   fetchEmployee,
   fetchProject,
   fetchCustomer,
   fetchProjectCount
  } from './api';
import {getColor, imageExists, groupCategories} from './utilities/index';

const dateFormat = 'YYYY-MM-DD';

export async function load() {
  const { projectList, employeeList, technologyList, clientList, unsortedClients, projectsCount } = await getData();
  const categories = await groupCategories(clientList);
  categories.clients = clientList.map((_, i) => i);
  categories.projects = projectList.map((_, i) => i);
  categories.employees = employeeList.map((_, i) => i);
  categories.skills = technologyList.map((_, i) => i);
  return {
    categories,
    projectList,
    employeeList,
    technologyList,
    clientList,
    unsortedClients,
    projectsCount
  };
}

async function getData() {
   function getTechList(technologies, clientId, projectId, employeeId) {   
    if (technologies.length === 0) return [];
    return technologies.map(technology => {
      let techObj = technologyList.find(t => t.name.toLowerCase() === technology.toLowerCase()); 
      if (techObj) {
        if (clientId && !techObj.clients.includes(clientId))
          techObj.clients.push(clientId);
        if (projectId && !techObj.projects.includes(projectId))
          techObj.projects.push(projectId);
        if (employeeId && !techObj.employees.includes(employeeId))
          techObj.employees.push(employeeId);
      } else {
        techObj = {
          id: technologyIdCounter++,
          name: technology,
          highlight: false,
          clients: clientId ? [clientId] : [],
          projects: projectId ? [projectId] : [],
          employees: employeeId ? [employeeId] : []
        };
        technologyList.push(techObj);
      }
      return techObj.id;
    });
  }

  function getClientId(client) {
    if (client.length === 0) return -1;
    return client.map(client => {
      let clientObj = clientList.find(t => t.name.toLowerCase() === client.toLowerCase());  
      return clientObj.id;
    })
  }

  function getClientColor(client) {
    if (client.length === 0) return -1;
    return client.map(client => {
      let clientObj = clientList.find(t => t.name.toLowerCase() === client.toLowerCase());  
    return clientObj.color;
    });
  }

  function updateClient(clientId, projectId, duration, employees, skills) {
   if(!clientList[clientId].projects.includes(projectId)) clientList[clientId].projects.push(projectId);
    clientList[clientId].hours += duration;
    union(clientList[clientId].employees, employees);
    union(clientList[clientId].skills, skills);
  }

  function updateEmployee(clientId, projectId, employees) {
  
    Object.keys(employees).forEach(function(key){

       let employeeId = employees[key];
       if(employeeList[employeeId] !== undefined){
        employeeList[employeeId].projects.push(projectId);
        if (!employeeList[employeeId].clients.includes(clientId))
          employeeList[employeeId].clients.push(clientId);
       }
    })
    }

  function getEmployeeList(employees) {
    return employees.map(employee => employeeList.find(e => e.name.toLowerCase() === employee.toLowerCase()).id);
  }

  function getDates(startDates, endDates) {
    const startDateList = startDates.split(',').map(date => date.trim());
    const endDateList = endDates ? endDates.split(',').map(date => date.trim()) : [];
    const startDate = startDateList[0];
    let endDate;
    if (startDateList.length === endDateList.length) {
      // Number of days doesn't always correspond to the month
      const endDateSplitted = endDateList[endDateList.length - 1].split('-');
      const year = endDateSplitted[0];
      const month = endDateSplitted[1];
      endDate = moment(`${year}-${month}`).endOf('month').format(dateFormat);
    } else  // Ongoing project
      endDate = moment().format(dateFormat);
    return { startDate, endDate };
  }


  const {employees } = await fetchEmployee();
  if (!employees) return Error;

  const {clients} = await fetchCustomer();
  if (!clients) return Error;
  
  const {projects} = await fetchProject();
  if (!projects) return Error;
  
  const {projectsCount} = await fetchProjectCount();
  if (!projectsCount) return Error;


  let clientList = [];
  let technologyList = [];
  let projectList = [];
  let employeeList = [];
  let technologyIdCounter = 0;
  for (let employee of employees) {
    let img;
    try {
      img = `/img/employees/${[employee.firstName, employee.lastName].join('_').replace(/\s/g, '_')}.jpg`;
      await imageExists(img);
    } catch {
      img = null;
    }
    
    employeeList.push({
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      highlight: true,
      brushedDisplay: true,
      roll: `${employee.role ? employee.role : ''}`,
      img,
      dateInit: moment(`${employee.startYear}-01-01`).format(dateFormat),
      dateEnd: `${employee.endYear ? moment(employee.endYear + '-01-01').format(dateFormat) : moment().format(dateFormat)}`,
      location:employee.location,
      birthYear: employee.birthYear,
      skills: getTechList(employee.technologies, undefined, undefined, employee.id),
      projects: [],
      clients: []
    });
  }

  for (const client of clients) {
    let imageSrc = `/img/logos/${client.name.trim().replace(/\s/g, '_')}.png`;
    try {
      var color = await getColor(imageSrc);
    } catch (error) {
      color = '';
      imageSrc = '/img/logos/company_placeholder.png';
    }
    clientList.push({
      id: client.id,
      name: client.name,
      hours: 0,
      color: color,
      logo: imageSrc,
      highlight: true,
      projects: [],
      category: client.category,
      description: client.description ? client.description : '',
      location: client.location,
      type: 'client',
      employees: [],
      skills: [],
      list: []
    });
    
  }

  clientList.push({
    id: clientList.length ,
    name: 'Other',
    hours: 0,
    color: '#3E5641',
    logo: '/img/logos/company_placeholder.png',
    highlight: true,
    projects: [],
    category: 'Other',
    description: 'Projects without client.',
    location: '',
    type: 'client',
    employees: [],
    skills: [],
    list: []
  });

 Object.keys(projects).forEach(function(key) {
  let project = projects[key];
     const { startDate, endDate } = getDates(project.startDates, project.endDates);
     const duration = Math.floor(moment.duration(moment(endDate).diff(moment(startDate))).asHours());
     let clientId = getClientId(project.client);
     const color = getClientColor(project.client);
     clientId = clientId === -1 ? clients.length : clientId[0];
     const employees = getEmployeeList(project.employees);
    const skills = getTechList(project.technologies, clientId, project.id);
    updateClient(clientId, project.id, duration, employees, skills);
    updateEmployee(clientId, project.id, employees);
    projectList.push({
      id: project.id,
      name: project.name,
      highlight: true,
      brushedDisplay: true,
      type: project.type ? project.type : 'Normal',
      description: project.description,
      clientId,
      employees,
      dateInit: new Date(startDate),
      dateEnd: new Date(endDate),
      skills,
      color,
      hours: duration
    });

});
  
  

  const unsortedClients = [...clientList];
  clientList.sort((a, b) => b.hours - a.hours);
  return { projectList, employeeList, technologyList, clientList, unsortedClients, projectsCount };
}


export default {
  load
};
