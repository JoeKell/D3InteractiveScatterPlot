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

// create svg container
var svg = d3.select("#scatter").append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// Create chart title
chartGroup.append("text")
.attr("transform", `translate(${chartWidth / 2}, 0)`)
.attr("x",0)
.attr("y",-40)
.classed("title", true)
.text("Relationships Between Census Data");

var variableChartGroup = chartGroup.append("g");

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

// Create group for y-axis labels
var yLabelsGroup = chartGroup.append("g")
.attr("transform", "rotate(-90)");
var smokesLabel = yLabelsGroup.append("text")
.attr("x", 0 - chartHeight/2)
.attr("y", -40)
.attr("value", "smokes") // value to grab for event listener
.classed("active", true)
.text("Smokers (%)");
var obesityLabel = yLabelsGroup.append("text")
.attr("x", 0 - chartHeight/2)
.attr("y", -65)
.attr("value", "obesity") // value to grab for event listener
.classed("inactive", true)
.text("Obesity (%)");
var povertyLabel = yLabelsGroup.append("text")
.attr("x", 0 - chartHeight/2)
.attr("y", -90)
.attr("value", "poverty") // value to grab for event listener
.classed("inactive", true)
.text("Poverty (%)");

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokes";


function UpdatePlot(data,xVal,yVal) {
    variableChartGroup.html("")

    var xData=[];
    var yData=[];

    data.forEach( function(d){
        xData.push(d[xVal]);
        yData.push(d[yVal]);
    });



    // scale y to chart height
    var yMin=d3.min(yData);
    var yMax=d3.max(yData);
    var yBuffer = (yMax-yMin)/16;
    var yScale = d3.scaleLinear()
        .domain([yMin-yBuffer,yMax+yBuffer])
        .range([chartHeight, 0]);


    // scale x to chart width
    var xMin=d3.min(xData);
    var xMax=d3.max(xData);
    var xBuffer = (xMax-xMin)/16;
    var xScale = d3.scaleLinear()
    .domain([xMin-xBuffer,xMax+xBuffer])
    .range([0, chartWidth]);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    variableChartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);


    
    // set y to the y axis
    variableChartGroup.append("g")
    .call(yAxis);

    variableChartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[xVal]))
    .attr("cy", d => yScale(d[yVal]))
    .attr("r", 12)
    .attr("class","stateCircle");

    data.forEach( function(d){
        variableChartGroup.append("text")
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

    UpdatePlot(data,"age","smokes");




    // x axis labels event listener
    xLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // changes classes to change bold text
            switch(chosenXAxis) {
                case "age":
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                    healthcareLabel.classed("active", false).classed("inactive", true);
                break;
                case "income":
                    incomeLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    healthcareLabel.classed("active", false).classed("inactive", true);
                break;
                case "healthcare":
                    healthcareLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                break;
            }

            UpdatePlot(data,value,chosenYAxis);
        }
    });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            // changes classes to change bold text
            switch(chosenYAxis) {
                case "smokes":
                    smokesLabel.classed("active", true).classed("inactive", false);
                    obesityLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                break;
                case "obesity":
                    obesityLabel.classed("active", true).classed("inactive", false);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                break;
                case "poverty":
                    povertyLabel.classed("active", true).classed("inactive", false);
                    smokesLabel.classed("active", false).classed("inactive", true);
                    obesityLabel.classed("active", false).classed("inactive", true);
                break;
            }

            UpdatePlot(data,chosenXAxis,value);
        }
    });

}).catch(function(error) {
    console.log(error);
});