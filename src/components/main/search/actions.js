import React from 'react';
/**
 * 
 * @param {string} word value to search in employees, clients, projects and skills  
 * @param {props} props contains all the state employees, projects, skills and clients to search 
 */
export function search(word, props) {
  const { projects, employees, skills, clients, selectedObjects } = props;
  const srchWord = word.toLowerCase();

  if (srchWord.length > 0 && srchWord !== '' && srchWord !== ' ') {

    //search in projects
    const projectResults = projects.filter(p => {
      const name = p.name.toLowerCase();
      p.searchType = 'PROJECT';
      return name.includes(srchWord) && !existsInArray(p, selectedObjects); //check if it exists in tag list. send obj
    });
    //search in results
    const employeesResults = employees.filter(e => {
      const name = e.name.toLowerCase();
      e.searchType = 'EMPLOYEE';
      return name.includes(srchWord) && !existsInArray(e, selectedObjects);
    });
    //search in skills
    const skillsResults = skills.filter(s => {
      const name = s.name.toLowerCase();
      s.searchType = 'SKILL';
      return name.includes(srchWord) && !existsInArray(s, selectedObjects);
    });
    //search in clients
    const clientsResults = clients.filter(c => {
      const name = c.name.toLowerCase();
      c.searchType = 'CLIENT';
      return name.includes(srchWord) && !existsInArray(c, selectedObjects);
    });
    return [...projectResults, ...employeesResults, ...skillsResults, ...clientsResults];
  } else {
    return [];
  }
}

function existsInArray(obj, arr) {
  return arr.find(e => e.id === obj.id && e.searchType === obj.searchType);
}

export function removeItem(item, IArray) {
  return IArray.filter(o => o.id !== item.id && o.searchType !== item.searchType);
}

export function getIcon(item) {
  switch (item.searchType) {
    case 'EMPLOYEE':
      return <i className="fas fa-user"></i>;
    case 'CLIENT':
      return <i className="fas fa-building"></i>;
    case 'PROJECT':
      return <i className="fas fa-square"></i>;
    case 'SKILL':
      return <i className="fas fa-wrench"></i>;
    default:
      return <i className="fas fa-question-circle"></i>;
  }
}

export default { search, removeItem, getIcon };