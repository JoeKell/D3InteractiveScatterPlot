function UpdatePlot(data,xVal,yVal) {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

    // svg params
  var svgHeight = 800;
  var svgWidth = 960;

    // margins
  var margin = {
    top: 80,
    right: 50,
    bottom: 100,
    left: 105
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

    var xData=[];
    var yData=[];

    data.forEach( function(d){
        xData.push(d[xVal]);
        yData.push(d[yVal]);
    });

    var yMin=d3.min(yData);
    var yMax=d3.max(yData);
    var yBuffer = (yMax-yMin)/16;
    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([yMin-yBuffer,yMax+yBuffer])
        .range([chartHeight, 0]);

    var xMin=d3.min(xData);
    var xMax=d3.max(xData);
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

    // Create chart title
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, 0)`)
        .attr("x",0)
        .attr("y",-40)
        .classed("title", true)
        .text("Relationships Between Census Data");

    // Create group for x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Average Age");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Household Income");
    var healthcareLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("People with Healthcare (%)");

    // Create group for x-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
    var smokesLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight/2)
        .attr("y", -40)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Smokers (%)");
    var obesityLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight/2)
        .attr("y", -65)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");
    var povertyLabel = yLabelsGroup.append("text")
        .attr("x", 0 - chartHeight/2)
        .attr("y", -90)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty (%)");

    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[xVal]))
        .attr("cy", d => yScale(d[yVal]))
        .attr("r", 12)
        .attr("class","stateCircle");

    data.forEach( function(d){
        chartGroup.append("text")
            .attr("x", xScale(d[xVal]))
            .attr("y", yScale(d[yVal])+4)
            .attr("class","stateText")
            .text(d.abbr);
    });

}



// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    // parse data
    data.forEach(function(data) {
      data.age=+data.age;
      data.income=+data.income;
      data.healthcare=+data.healthcare;
      data.smokes=+data.smokes;
      data.obesity=+data.obesity;
      data.poverty=+data.poverty;
    });

    UpdatePlot(data,"age","smokes")

}).catch(function(error) {
    console.log(error);
});