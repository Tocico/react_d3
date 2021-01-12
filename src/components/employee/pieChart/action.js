import { colorGetter, categoryImageGetter } from "../../../server/employee/utilities/index";

//Calculate percentage of project categories
function calculatePercentage(projects) {
  const projectCategoryNames = projects.map(project => project.category);
  const percentage = 100 / projectCategoryNames.length;
  const projectCategoryPercentages = {};
  projectCategoryNames.map(project => {
    if (projectCategoryPercentages[project]) {
      return (projectCategoryPercentages[project] =
        projectCategoryPercentages[project] + percentage);
    } else {
      return (projectCategoryPercentages[project] = percentage);
    }
  });
  return Object.keys(projectCategoryPercentages).map(key => {
    return {
      value: projectCategoryPercentages[key],
      label: key,
   
    };
  });
}

async function getCategoryLogoColor(projects){
    const grouped = {};
    for (let client of projects) {
      if (!(client.category in grouped)) grouped[client.category] = [client];
      else grouped[client.category].push(client);
    }
  
    let color;
    let arrayColor = [];
    for (let category in grouped) {
      let categoryLogo = categoryImageGetter(category);
      try {
        color = await colorGetter(categoryLogo);
      } catch (error) {
        color = "";
      }
      arrayColor.push(color);
    }
    return arrayColor
}

export { calculatePercentage, getCategoryLogoColor};
