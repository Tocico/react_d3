import moment from 'moment';
import * as d3 from 'd3';

/**
   * Set the Highlight state either to true or false
   * returns an array with the modified items
   *
   * @param highlight Boolean to set the state
   * @param modArray Array to modify
   */
export function setHighlight(highlight, modArray) {
  return modArray.map(d => {
    d.highlight = highlight;
    return d;
  });
}

/**
   * Modify the hightlight atribute of an object if it
   * matches the id
   *
   * @param highLight Boolean to set the state
   * @param modArray Array to modify
   * @param idArray array with number IDs to modify
   * @pram ifIncludes Boolean check if it includes or it does not
   */
export function setHighlightElement(highlight, idArray, modArray, ifIncludes) {
  return modArray.map(d => {
    if (idArray.includes(d.id) === ifIncludes) {
      d.highlight = highlight;
    }
    return d;
  });
}

/**
   * Modify the hightlight atribute of an object if it
   * matches the id
   *
   * @param highhighlightElementLight Boolean to set the state
   * @param highlightText boolean for the text
   * @param modArray Array to modify
   * @param idArray array with number IDs to modify
   * @pram ifIncludes Boolean check if it includes or it does not
   */
export function setHighlightText(highlightText, idArray, modArray, ifIncludes) {
  return modArray.map(d => {
    if (idArray.includes(d.id) === ifIncludes) {
      d.textHighlight = highlightText;
    }
    return d;
  });
}

export function unHighlightText(modArray) {
  return modArray.map(d => {
    d.textHighlight = false;
    return d;
  });
}
/**
 * Checks if the element skills match the id and modifies the highlight state to true
 * checks if clients from the element do not match 
 * 
 * @param id Number of skill 
 * @param modArray array to modify
 */
export function highlightElementWithSkill(id, modArray) {
  let clients = [];
  const projectsHighLight = modArray.map(d => {
    if (d.skills.includes(id)) {
      d.highlight = true;
      if (!clients.includes(d.clientId)) clients.push(d.clientId);
    } else {
      d.highlight = false;
    }
    return d;
  });
  return [clients, projectsHighLight];
}

/**
 * searches for skills in element, if it has it turns it's highlight state to true
 * @param {number} id of skill to search in element
 * @param {array} mdArray array to modify
 */
export function elementWithSkill(id, mdArray) {
  return mdArray.map(d => {
    d.highLight = d.skills.includes(id);
    return d;
  });
}

/**
 * search for an element with the id and return it
 * @param {number} id of the element to find
 * @param {array} array array to search
 */
export function getElementById(id, array) {
  return array.find(d => d.id === id);
}

/**
 * 
 * @param {*} objArr 
 * @param {*} initDate 
 * @param {*} InBruMonth 
 * @param {*} OutBruMonth 
 */
export function brushObjectByDate(objArr, initDate, InBruMonth, OutBruMonth) {
  return objArr.map(o => {
    const pInit = getMonthsDifference(initDate, o.dateInit);
    const pEnd = getMonthsDifference(initDate, o.dateEnd);
    o.brushedDisplay = OutBruMonth - pInit >= 0 && pEnd - InBruMonth >= 0 ? true : false;
    return o;
  });
}

export function reCalculateClientHours(clients, projects) {
  return clients.map(c => {
    let hours = 0;
    const projectsFiltered = projects.filter(p => p.clientId === c.id);
    projectsFiltered.forEach(p => {
      hours += p.brushedDisplay ? p.hours : 0;
    });
    c.hours = hours;
    return c;
  });
}


/**
 * returns the differente between two dates in months
 * @param {date} IDate initial date 
 * @param {date} ODate ending date
 */
export function getMonthsDifference(IDate, ODate) {
  return d3.timeMonth.count(IDate, ODate);
}

/**
 * returns adds the number of months to inital date and returns the date 
 * @param {*} month 
 * @param {*} initDate 
 */
export function getDateFromStep(month, initDate) {
  return moment(initDate).add(month, 'M').format('MMM YYYY');
}

export function resetBrushedDisplay(ModArray) {
  return ModArray.map(p => p.brushedDisplay = true);
}

export function setSelectedState(refArray, modArray) {
  const clients = modArray.clients.map(c => {
    c.selected = refArray.clients.includes(c.id);
    return c;
  });

  const employees = modArray.employees.map(e => {
    e.selected = refArray.employees.includes(e.id);
    return e;
  });
  const skills = modArray.skills.map(s => {
    s.selected = refArray.skills.includes(s.id);
    return s;
  });
  const projects = modArray.projects.map(p => {
    p.selected = refArray.projects.includes(p.id);
    return p;
  });

  return {
    employees: employees,
    clients: clients,
    projects: projects,
    skills: skills
  };
}


function removeNonRepeatedObj(outArray, objects, inArray) {
  return inArray.filter(id => {
    return outArray.includes(id) && !objects.includes(id) ? false : true;
  });
}

function mergeRepeated(inArr) {
  return Array.from(new Set(inArr));
}


/**
 * 
 * @param {dic} selectedData the current selected objects 
 * @param {ob} object the object you want to add
 * @param {dic} objectsDic array containing the current clients, employees, skills, and projects 
 */
export function addSelected(selectedData, object) {
  let clients = [...selectedData.clients],
    employees = [...selectedData.employees],
    skills = [...selectedData.skills],
    projects = [...selectedData.projects];
  switch (object.searchType) {
    case 'EMPLOYEE':
      employees = mergeRepeated([...employees, object.id]);
      skills = mergeRepeated([...skills, ...object.skills]);
      projects = mergeRepeated([...projects, ...object.projects]);
      clients = mergeRepeated([...clients, ...object.clients]);
      break;
    case 'CLIENT':
      clients = mergeRepeated([...clients, object.id]);
      projects = mergeRepeated([...projects, ...object.projects]);
      employees = mergeRepeated([...employees, ...object.employees]);
      skills = mergeRepeated([...skills, ...object.skills]);
      break;
    case 'PROJECT':
      projects = mergeRepeated([...projects, object.id]);
      employees = mergeRepeated([...employees, ...object.employees]);
      skills = mergeRepeated([...skills, ...object.skills]);
      clients = mergeRepeated([...clients, object.clientId]);
      break;
    case 'SKILL':
      skills = mergeRepeated([...skills, object.id]);
      projects = mergeRepeated([...projects, ...object.projects]);
      employees = mergeRepeated([...employees, ...object.employees]);
      clients = mergeRepeated([...clients, ...object.clients]);

      break;
    default:
      return selectedData;
  }
  return {
    employees: Array.from(new Set(employees)),
    clients: Array.from(new Set(clients)),
    projects: Array.from(new Set(projects)),
    skills: Array.from(new Set(skills))
  };

}


function getDataFromSelectedObjects(objs, stateData) {
  let clients = [];
  let employees = [];
  let skills = [];
  let projects = [];
  let locations = [];
  objs.forEach(o => {
    switch (o.searchType) {
      case 'EMPLOYEE':
        employees = [...employees, o.id];
        skills = [...skills, ...o.skills];
        projects = [...projects, ...o.projects];
        clients = [...clients, ...o.clients];
        locations = [...locations, ...o.locations];
        break;
      case 'CLIENT':
        clients = [...clients, o.id];
        projects = [...projects, ...o.projects];
        employees = [...employees, ...o.employees];
        skills = [...skills, ...o.skills];
        break;
      case 'PROJECT':
        projects = [...projects, o.id];
        employees = [...employees, ...o.employees];
        skills = [...skills, ...o.skills];
        clients = [...clients, o.clientId];
        break;
      case 'SKILL':
        skills = [...skills, o.id];
        projects = [...projects, ...o.projects];
        employees = [...employees, ...o.employees];
        clients = [...clients, ...o.clients];

        break;
      default:
        break;
    }
  });
  return {
    clients: mergeRepeated(clients),
    employees: mergeRepeated(employees),
    skills: mergeRepeated(skills),
    projects: mergeRepeated(projects)
  };
}

function getObjectsFromState(objs, stateData) {
  return objs.map(object => {
    switch (object.searchType) {
      case 'EMPLOYEE':
        return object = stateData.employees.find(o => o.id === object.id);
      case 'CLIENT':
        return object = stateData.clients.find(o => o.id === object.id);
      case 'PROJECT':
        return object = stateData.projects.find(p => p.id === object.id);
      case 'SKILL':
        return object = stateData.skills.find(s => s.id === object.id);
      default:
        return object;
    }
  });
}

export function removeSelected(selectedData, object, stateData, selectedTagList) {
  let selectedClients = selectedData.clients,
    selectedEmployees = selectedData.employees,
    selectedSkills = selectedData.skills,
    selectedProjects = selectedData.projects;
  let delObj = null;
  const tagListObjects = getObjectsFromState(selectedTagList, stateData);
  const dataFromSelectedObjects = getDataFromSelectedObjects(tagListObjects, stateData);

  switch (object.searchType) {
    case 'EMPLOYEE':
      delObj = stateData.employees.find(o => object.id === o.id);
      selectedEmployees = removeNonRepeatedObj([delObj.id], dataFromSelectedObjects.employees, selectedEmployees);
      selectedSkills = removeNonRepeatedObj(delObj.skills, dataFromSelectedObjects.skills, selectedSkills);
      selectedProjects = removeNonRepeatedObj(delObj.projects, dataFromSelectedObjects.projects, selectedProjects);
      selectedClients = removeNonRepeatedObj(delObj.clients, dataFromSelectedObjects.clients, selectedClients);
      break;
    case 'CLIENT':
      delObj = stateData.clients.find(o => o.id === object.id);
      selectedClients = removeNonRepeatedObj([delObj.id], dataFromSelectedObjects.clients, selectedClients);
      selectedEmployees = removeNonRepeatedObj(delObj.employees, dataFromSelectedObjects.employees, selectedEmployees);
      selectedSkills = removeNonRepeatedObj(delObj.skills, dataFromSelectedObjects.skills, selectedSkills);
      selectedProjects = removeNonRepeatedObj(delObj.projects, dataFromSelectedObjects.projects, selectedProjects);
      break;
    case 'PROJECT':
      delObj = stateData.projects.find(p => p.id === object.id);
      selectedProjects = removeNonRepeatedObj([delObj.id], dataFromSelectedObjects.projects, selectedProjects);
      selectedEmployees = removeNonRepeatedObj(delObj.employees, dataFromSelectedObjects.employees, selectedEmployees);
      selectedSkills = removeNonRepeatedObj(delObj.skills, dataFromSelectedObjects.skills, selectedSkills);
      selectedClients = removeNonRepeatedObj([delObj.clientId], dataFromSelectedObjects.clients, selectedClients);
      break;
    case 'SKILL':
      delObj = stateData.skills.find(s => s.id === object.id);
      selectedSkills = removeNonRepeatedObj([delObj.id], dataFromSelectedObjects.skills, selectedSkills);
      selectedEmployees = removeNonRepeatedObj(delObj.employees, dataFromSelectedObjects.employees, selectedEmployees);
      selectedProjects = removeNonRepeatedObj(delObj.projects, dataFromSelectedObjects.projects, selectedProjects);
      selectedClients = removeNonRepeatedObj(delObj.clients, dataFromSelectedObjects.clients, selectedClients);
      break;
    default:
      return selectedData;
  }

  return {
    employees: selectedEmployees,
    clients: selectedClients,
    projects: selectedProjects,
    skills: selectedSkills
  };
}

/**
 * checks all the projects and sets the inital and ending date
 * @param {array} projects array with all the projects
 */
export function getDateRange(projects) {
  const initDates = projects.map(p => moment(p.dateInit));
  const endDates = projects.map(p => moment(p.dateEnd));
  const min = moment.min(initDates).toDate();
  const max = moment.max(endDates).toDate();
  return [min, max];
}

export function getBrushedProjectsEmployees(projects, employees) {
  let employeesId = [];
  projects.forEach(p => {
    employeesId = p.brushedDisplay ? [...employeesId, ...p.employees] : employeesId;
  });
  return employees.map(e => {
    e.brushedDisplay = employeesId.includes(e.id) ? true : false;
    return e;
  });
}

export default {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  getElementById,
  elementWithSkill,
  getDateRange,
  setHighlightText,
  unHighlightText,
  getDateFromStep,
  getMonthsDifference,
  resetBrushedDisplay,
  addSelected,
  setSelectedState,
  removeSelected,
  brushObjectByDate,
  reCalculateClientHours,
  getBrushedProjectsEmployees
};

