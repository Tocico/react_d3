import { fetchData } from "./api";
import { colorGetter, skillsLogoGetter } from "./utilities/index"
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

export async function getData(id) {
  const employee = await fetchData(id);
  if (!employee) return Error;

  const { projects } = employee; 
  const { technologies } = employee;

  /*-------------------   Barchart -------------------------- */
  let projectsBarChart = [];
  for (let project of projects) {
    const { startDate, endDate, endDateList, startDateList } = getDates(
      project.startDates,
      project.endDates
    );
    const duration =
      Math.floor(
        moment.duration(moment(endDate).diff(moment(startDate))).asMonths()
      ) / 12; 
    let imageSrc = `/img/logos/${project.client
      .trim()
      .replace(/\s/g, "_")}.png`;
    let color;
    try {
      color = await colorGetter(imageSrc);
    } catch (error) {
      color = "#3E5641";
      imageSrc = "/img/logos/company_placeholder.png";
    }
   
    projectsBarChart.push({
      id: project.id,
      name: project.name,
      category: project.category,
      client: project.client,
      startDate: startDate,
      endDate:
        endDateList.length !== startDateList.length ? "Ongoing" : endDate,
      description: project.description,
      img: imageSrc,
      color: color,
      projectPeriod: duration
    });
  }

  function getDates(startDates, endDates) {
    const startDateList = startDates.split(",").map(date => date.trim());
    const endDateList = endDates
      ? endDates.split(",").map(date => date.trim())
      : [];
    const startDate = startDateList[0];
    let endDate;
    if (startDateList.length === endDateList.length) {
      // Number of days doesn't always correspond to the month
      const endDateSplitted = endDateList[endDateList.length - 1].split("-");
      const year = endDateSplitted[0];
      const month = endDateSplitted[1];
      endDate = moment(`${year}-${month}`)
        .endOf("month")
        .format(dateFormat);
    } // Ongoing project
    else endDate = moment().format(dateFormat);
    return { startDate, endDate, endDateList, startDateList };
  }

  /*-------------------   Bubblechart -------------------------- */
  let technology = [];

 //Colors of labels on bubblechart
 // If you want to add more category, then you can add color here manually.
 //We have 10 skill categories now
  function getColor(category){
    switch (category) {
      case 'Web':
        return { R: 214, G: 142, B: 122 }
      case 'Tools':
        return { R: 78, G: 179, B: 114 }
      case 'Database':
        return { R: 209, G: 199, B: 54 }
      case 'Graphical':
        return { R: 216, G: 87, B: 98 }
      case 'Programming/Skills':
        return { R: 59, G: 89, B: 115 }
      case 'Productivity':
        return { R: 222, G: 143, B: 76 }
      case 'Framework':
        return { R: 124, G: 105, B: 144 }
      case 'Methodology':
        return { R: 71, G: 154, B: 139 }
      case 'Environment':
        return { R: 170, G: 110, B: 40 }
      case 'Other':
        return { R: 117, G: 165, B: 214 }
      case 'All':
        return { R: 154, G: 58, B: 58 }
      default:
        return category;
    }
  }
 
    //Make a new object
    for (let tech in technologies) {
      let skills = technologies[tech];

      console.log(tech);
      for (let name of skills) {
        let img = `../img/skills/${name.trim().replace(/\s/g, "_")}.png`;
        try {
          await skillsLogoGetter(img);
        } catch {
          img = name;
        }
        technology.push({
          category: tech,
          name: name,
          color: getColor(tech),
          icon: img,
          value: 1
        });
      }
    }

    //Check if technologies is empty object or not. 
    //If it is empty object then it doesn't add category 'All'
    //Otherwise add category 'All' at the end of technology list.
    if(Object.entries(technologies).length !== 0){
      technology.push({
        category: 'All',
        name: 'all',
        color:getColor('All'),
      })
    }
  
  //Sort in descending order
  const categoryDataList = [];
  for (let value of technology) {
    if (!(value.category in categoryDataList))
      categoryDataList[value.category] = [value];
    else categoryDataList[value.category].push(value);
  }
  technology.sort(function(a, b) {
    return (
      categoryDataList[b.category].length - categoryDataList[a.category].length
    );
  });

  return {
    employeeProfile: employee,
    projects: projects,
    projectsBarChart: projectsBarChart,
    technology: technology
  };
}
