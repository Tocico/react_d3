import React from "react";
import * as d3 from "d3";

const Slice = props => {
  const { pie } = props;

  let arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(150);

  return pie.map((slice, index) => {
    let { color } = slice.data.value;
    return (
      <g key={index}>
        <path d={arc(slice)} fill={color} />
      </g>
    );
  });
};

export { Slice };
