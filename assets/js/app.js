// data
var dataArray = [1, 2, 3];
var dataCategories = [4, 5, 6];

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

    // svg params
  var svgHeight = 800;
  var svgWidth = 800;

    // margins
  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  };

    // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
  var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // shift everything over by the margins
  var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scale y to chart height
  var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray)])
        .range([chartHeight, 0]);

  var xMin=d3.min(dataCategories);
  var xMax=d3.max(dataCategories);
  var xBuffer = (xMax-xMin)/16;
    // scale x to chart width
  var xScale = d3.scaleLinear()
        .domain([xMin-xBuffer,xMax+xBuffer])
        .range([0, chartWidth]);

    // create axes
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
  chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
  chartGroup.append("g")
        .call(yAxis);

  chartGroup.selectAll("circle")
        .data(dataArray)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(dataCategories[i]))
        .attr("cy", d => yScale(d))
        .attr("r", 20)
        .attr("class","stateCircle");

  dataArray.forEach( function(d,i){
    chartGroup.append("text")
        .attr("x", xScale(dataCategories[i]))
        .attr("y", yScale(d)+5)
        .attr("class","stateText")
        .text("HI");//Enter state abr here dynamically
  });

}

makeResponsive();
