import * as d3 from 'd3';

const sliceHeight = 50;
const projectHeight = 25;
const projectRadius = sliceHeight / 2;
const imageSize = 40;
const imageDistance = 40;
const projectPadding = (2 * Math.PI) / 180;
const clientArcPadding = (1.2 * Math.PI) / 180;
const maxSkills = 40;

//Create a pie chart with the clients total time in a project
export function calculatePieClient(props, radius) {
  //arc generator for clients
  const arcGenerator = d3
    .arc()
    .padAngle(clientArcPadding) //pad angle defines the distance between each arc
    .cornerRadius(4); //cornerRadius

  //arc generator for the Text labels
  const LogoArcGenerator = d3
    .arc()
    .outerRadius(radius + imageDistance)
    .innerRadius(radius + imageDistance);

  //PIE object to calculate the arc distribution
  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.type === 'category' ? 3 : d.hours;
    });
  //arc array with the position and information in the pie
  const arcs = pie(props.annularSectors);
  console.log(props.annularSectors);

    //create an object SLICES in order to update the state
  //contains all the information one slice needs in order to be rendered
  let projectSlice = [];
  const clientSlice = arcs.map((d, i) => {
    const path = arcGenerator({
      startAngle: d.startAngle,
      endAngle: d.endAngle,
      innerRadius: radius - sliceHeight,
      outerRadius: radius
    });

    const centroid = LogoArcGenerator.centroid(d);
    //calculate the anchor point of the image depending on its position on the center
    let anchor = centroid;
    let textAnchor = 'start';
    let textPos = centroid;
    const textPaddingSides = 10;
    const textPaddingUp = 5;
    const halfImage = imageSize / 2;
    anchor = [centroid[0] - halfImage, centroid[1] - halfImage];

    if (anchor[0] > 0 && anchor[1] < 0) {
      textPos = [centroid[0] + halfImage + textPaddingSides, centroid[1]];
    } else if (anchor[0] < 0 && anchor[1] < 0) {
      textPos = [centroid[0] - halfImage - textPaddingSides, centroid[1] + textPaddingUp];
      textAnchor = 'end';
    } else if (anchor[0] < 0 && anchor[1] > 0) {
      textPos = [centroid[0] - halfImage - textPaddingSides, centroid[1] + textPaddingUp];
      textAnchor = 'end';
    } else if (anchor[0] > 0 && anchor[1] > 0) {
      textPos = [centroid[0] + halfImage + textPaddingSides, centroid[1]];
    }


    const logo = {
      centroid: anchor
    };

    if (d.data.type === 'client') {
      const projects = props.projects.filter(project => d.data.projects.includes(project.id));
      // const projects = getObjects(d.data.projects, props.projects);
      const projectSlices = calculatePieProject(
        d.startAngle + projectPadding,
        d.endAngle - projectPadding,
        projects,
        radius
      );
      projectSlice = projectSlice.concat(projectSlices);
    }

    return {
      path,
      fill: d.data.color,
      logo,
      textAnchor: textAnchor,
      textPos: textPos,
      img: d.data.logo,
      id: d.data.id,
      highlight: d.data.highlight,
      data: d.data,
    };
  });

  return { clientSlice, projectSlice };
}

//add to the state slices of clients to draw
function calculatePieProject(initAngle, endAngle, projects, radius) {
  const angleScale = d3
    .scaleLinear()
    .domain([0, 2 * Math.PI])
    .range([initAngle, endAngle]);
  //arc generator for clients
  const arcGenerator = d3
    .arc()
    .padAngle(0.013) //pad angle defines the distance between each arc
    .cornerRadius(50); //cornerRadius
  //PIE object to calculate the arc distribution
  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.brushedDisplay ? d.hours : 0;
    });

  //arc array with the position and information in the pie
  const arcs = pie(projects);

  //create an object SLICES in order to update the state
  //contains all the information one slice needs in order to be rendered
  const slices = arcs.map((d) => {
    const path = arcGenerator({
      startAngle: angleScale(d.startAngle),
      endAngle: angleScale(d.endAngle),
      innerRadius: radius - projectRadius - projectHeight / 2,
      outerRadius: radius - projectRadius + projectHeight / 2,
    });
    d.path = path;
    return d;
  }).filter(d => d.data.brushedDisplay);
  return slices;
}

//Create a hierarchy and sort it alphabetically
export function createLinks(skills) {
  const highlightedSkills = skills.filter(skill => skill.highlight === true);
  const children = highlightedSkills.length > maxSkills ? skills.slice(0, maxSkills) : highlightedSkills;
  const skillsData = {
    name: 'Front-End',
    children
  };

  const data = skillsData;
  const root = d3
    .hierarchy(data)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
  const treeLayout = d3.tree();
  const angleScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, 360]);
  const nodes = treeLayout(root);

  for (let i in nodes.children) {
    let node = nodes.children[i];
    node.angle = angleScale(node.x); //set angle in radians
    node.textRotation = -node.angle;
    node.anchorText = node.angle < 90 || node.angle > 270 ? 'start' : 'end';

  }

  return nodes;
}

export function calculateEmployee() {
  const circle = {
    radius: '28',
    fill: '#98abc5',
    x: '0',
    y: '0'
  };

  return { circle };
}

export function getInitials(name) {
  const splitted = name.split(' ');
  return `${splitted[0].charAt(0)}.${splitted[splitted.length - 1].charAt(0)}`;
}

export default {
  calculatePieClient,
  createLinks,
  calculateEmployee,
  getInitials
};
