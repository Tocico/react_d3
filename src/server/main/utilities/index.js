import ColorThief from 'color-thief';
import { union } from 'components/main/general';


/* Get colors */
var colorThief = new ColorThief();

export function getColor(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      let dominantColor = colorThief.getColor(img);
      dominantColor = dominantColor.map(x => {
        x = parseInt(x).toString(16);
        return (x.length === 1) ? '0' + x : x;
      });
      resolve(`#${dominantColor.join('')}`);
    };
    img.onerror = () => reject('');
    img.src = `${process.env.PUBLIC_URL}${src}`;
  });
}

/* Check if imgage exists */
export function imageExists(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = `${process.env.PUBLIC_URL}${src}`;
    });
  }

/* Get group categories */
let maxAnnularSectors; 
export async function groupCategories(clients) {
    const grouped = {};
    for (let client of clients) {
      if (!(client.category in grouped)) grouped[client.category] = [client];
      else grouped[client.category].push(client);
    }
  
    const sorted = [];
    let counter = clients.length;
    for (let category in grouped) {
      let imageSrc = `/img/categories/${category.trim().replace(/\s/g, '_')}.png`;
      try {
        var color = await getColor(imageSrc);
      } catch (error) {
        color = '';
        imageSrc = '/img/logos/company_placeholder.png';
      }
  
      let employees = [];
      let projects = [];
      let skills = [];
      let clients = [];
      for (let client of grouped[category]) {
        union(employees, client.employees);
        union(projects, client.projects);
        union(skills, client.skills);
        clients.push(client.id);
      }
  
      sorted.push({
        id: counter++,
        name: category,
        category: 'Categories',
        type: 'category',
        list: grouped[category],
        hours: grouped[category].length,
        selected: false,
        color,
        highlight: true,
        textHighlight: false,
        logo: imageSrc,
        projects,
        employees,
        skills,
        clients
      });
    }
  
    sorted.sort((a, b) => b.list.length - a.list.length);
    console.log(sorted)
    const categories = getLargestClients(sorted);
    maxAnnularSectors = sorted.length;
    console.log(categories)
    console.log(categories[maxAnnularSectors].list)
    categories[maxAnnularSectors].hours = categories[maxAnnularSectors].list.length;
    categories[maxAnnularSectors].list.sort((a, b) => b.hours - a.hours);
  
    return {
      id: counter++,
      name: 'Categories',
      category: 'Categories',
      type: 'root',
      list: categories,
      hours: 0,
      color: '#000',
      selected: false,
      highlight: true,
      textHighlight: false,
      projects: [],
      employees: [],
      clients: [],
      skills: [],
      logo: ''
    };
  }

  export function getLargestClients(clients) {
    let imageSrc = '/img/categories/more.png';
    if (!clients) return clients;
    const clientList = clients.slice(0, maxAnnularSectors);
    const other = {
      id: -1,
      name: 'More',
      category: clients[0].category,
      type: 'more',
      highlight: true,
      color: '#2D2A32',
      hours: 0,
      selected: false,
      list: [],
      projects: [],
      employees: [],
      clients: [],
      skills: [],
      logo: imageSrc
    };
  
    for (let i = maxAnnularSectors; i < clients.length; i++) {
      other.hours += clients[i].hours;
      other.list.push(clients[i]);
      union(other.employees, clients[i].employees);
      other.projects.push(...clients[i].projects);
      if (clients[i].type === 'category')
        other.clients.push(...getClients(clients[i].list));
      else
        other.clients.push(clients[i].id);
      union(other.skills, clients[i].skills);
    }
    clientList.push(other);
  
    return clientList;
  }
  
  function getClients(clients) {
    const list = [];
    for (let client of clients) {
      if (client.type === 'category') list.push(...getClients(clients));
      else list.push(client.id);
    }
    return list;
  }
