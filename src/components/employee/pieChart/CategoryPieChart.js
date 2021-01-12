import React from "react";
import * as d3 from "d3";
import { calculatePercentage, getCategoryLogoColor } from "./action";
import { Slice } from "./Slice";

const height = 400;
const width = 400;

class CategoryPieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      d3Data: [],
      d3Color: []
    };
  }

  async componentDidMount() {
    const { projects } = this.props;
    const d3Data = calculatePercentage(projects);
    const d3Color = await getCategoryLogoColor(projects);
    this.setState({ d3Data: d3Data, d3Color: d3Color });
  }

  render() {
    const { d3Data, d3Color } = this.state;

    for (let i = 0; i < d3Data.length; i++) {
      d3Data[i].color = d3Color[i];
    }

    const pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.value.value;
      });
    const data_ready = pie(d3.entries(d3Data));
    return (
      <div>
        <svg height={height} width={width}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            <Slice pie={data_ready} width={width} height={height} />
          </g>
        </svg>
        <div className="legendBox">
        {data_ready.map((e, i) => {
          return (
            <div key={i}>
              <span
                style={{ backgroundColor: e.data.value.color }}
                className="chart-label"
              ></span>
              <span>{e.data.value.label}</span>
            </div>
          );
        })}
        </div>
      </div>
    );
  }
}

export { CategoryPieChart };
