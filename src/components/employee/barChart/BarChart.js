import React, { Component } from "react";
import { groupedProjects } from "./drawChart";
import Dialogue from "./Dialogue";
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;

    const { grouped } = groupedProjects(data);
    this.state = {
      data: grouped,
      width: 800,
      height: 650,
      recentData: [],
      dialogueIsShown: false
    };
    this.showProject = this.showProject.bind(this);
  }
  componentDidMount() {
    this.chart();
  }

  //Dialogue
  showProject = data => {
    this.setState({ dialogueIsShown: !this.state.dialogueIsShown });
    if (this.state.recentData !== data) {
      this.setState({ dialogueIsShown: true });
    }
    this.setState({
      recentData: data
    });
  };

  chart = () => {
    let barPadding = 10; //value which dictate the separation between bars
    let rangeBands = []; // dummy array
    let cummulative = 0; //cummulative value to position bars

    const data = Object.keys(this.state.data).map((companyName, i) => {
      let returnValue = {
        values: this.state.data[companyName],
        companyName: companyName,
        cummulative: cummulative,
      };
      cummulative += this.state.data[companyName].length;
      
      this.state.data[companyName].map(value => {
        returnValue['color'] = value.color;
        return rangeBands.push(i);
      });
      return returnValue;
    });
    
    const margin = { top: 20, right: 20, bottom: 60, left: 190 },
      width = this.state.width - margin.left - margin.right,
      height = this.state.height - margin.top - margin.bottom;

    let svg = d3
      .select(".rowChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // The scale spacing the groups
    // Set different height depends how many cummulative have.
    const y_category = d3.scaleLinear().rangeRound([0,
        cummulative > 8 ? height  : cummulative < 4 ? 150 : 400
    ]);

    //create dummy scale  to get rangeBands
    const y_defect = d3
    .scaleBand()
    .rangeRound([0, height], 0.1)
    .domain(rangeBands);

    const y_category_domain = y_defect.bandwidth() * rangeBands.length ;
  
    y_category.domain([0, y_category_domain]);

    const x = d3.scalePow().range([0, width]);

    x.domain([
      0,
      d3.max(data, function(d) {
        return d3.max(d.values, function(key) {
          return Math.ceil(key.projectPeriod);
        });
      })
    ]);

    const xAxis = d3.axisBottom().scale(x);
    xAxis.ticks(5).tickSize(- height - 5).tickPadding([10]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis)
      .append("text")
      .attr("dy", ".10em")
      .attr("fill", "#000")
      .style("text-anchor", "end")
      .text("Year")
      .attr("transform", "translate( -20 , 15 )");

    let category_g = svg
      .selectAll(".category")
      .data(data)
      .enter()
      .append("g")
      .attr("class", function(d) {
          return "category category-" + d.companyName;
      })
      .attr("transform", function(d) { //Offset by inner group size
        return (
          "translate(0," + 
          y_category(d.cummulative * y_defect.bandwidth()) +
          ")"
        );
      })
      .attr("fill", function(d) {
          return d.color;
      });

      //Add labels
      category_g
      .selectAll(".category-label")
      .data(function(d) {
        return [d];
      })
      .enter()
      .append("text")
      .attr("class", function(d) {
        return "category-label category-label-" + d.companyName;
      })
      .attr("transform", function(d) {
        var x_label = y_category(
          (d.values.length * y_defect.bandwidth() + barPadding) / 2 + 4
        );
        var y_label = -5;
        return "translate(" + y_label + "," + x_label + ")";
      })
      .text(function(d) {
        return d.companyName;
      })
      .attr("text-anchor", "end")
      .attr("fill", "#000");

    // draw barchart
    let defect_g = category_g
      .selectAll(".defect")
      .data(function(d) {
        return d.values;
      })
      .enter()
      .append("g")
      .attr("class", function(d) {
        return "defect defect-" + d.name;
      })
      .attr("transform", function(d, i) { 
        return "translate(0," + y_category(i * y_defect.bandwidth()) + ")";
      });

      defect_g
      .selectAll(".rect")
      .data(function(d) {
        return [d];
      })
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr("height", y_category(y_defect.bandwidth() - barPadding))
      .attr("y", function(d) {
        return y_category(barPadding);
      })
      .attr("x", x(0))
      .attr("width", function(d) {
        return x(d.projectPeriod);
      }) 
      .on("mouseover", function() {
        d3.select(this).style("opacity", 0.5);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1);
      })
      .on("click", d => {
        this.showProject(d);
      });

  };
  

  render() {
    return (
      <div className="rowChart">
        <Dialogue
          dialogueInfo={this.state.recentData}
          dialogueIsShown={this.state.dialogueIsShown}
        />
      </div>
    );
  }
}

export default BarChart;
