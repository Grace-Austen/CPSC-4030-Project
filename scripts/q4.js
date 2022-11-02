//Open both csv's and combine data
d3.csv("../CPSC-4030-Project/data/migrationmanyyears_final.csv").then((dataset1) => {
    d3.csv("../CPSC-4030-Project/data/meanyearsschooling_final.csv").then((dataset2) => {
        //Create combined data array
        var combinedData = [];

        //Iterate through both datasets
        for (let element1 of dataset1) {
            //If the country is already on there, skip it in the first dataset
            if (combinedData.length > 0 && combinedData[combinedData.length - 1]["country"] == element1["Country"]) {
                continue;
            }

            //If the periods and countries match up, add it and go to next country in first dataset
            for (let element2 of dataset2) {
                if (element1["Period"] == element2["Period"] && element1["Period"] == "2015-2020" && element1["Country"] == element2["Country"]) {
                    let newData = {
                        "country": element1["Country"],
                        "migration": element1["Net"],
                        "school": element2["Years"]
                    };

                    combinedData.push(newData);

                    break;
                }
            }
        }
        
        //Select the svg we will be using
        var svg = d3.select("#q4-viz");

        var dims = {
            width: 1000,
            height: 500,
            margin: {
                top: 10,
                bottom: 50,
                right: 10,
                left: 50
            }
        };

        //Set the width and height for the svg
        svg.style("width", dims.width);
        svg.style("height", dims.height);

        //Create x and y scales
        var xScale = d3.scaleLinear()
                        .domain(d3.extent(combinedData, d => +d["school"]))
                        .range([dims.margin.left, dims.width - dims.margin.right]);

        var yScale = d3.scaleLinear()
                        .domain(d3.extent(combinedData, d => +d["migration"]))
                        .range([dims.height - dims.margin.bottom, dims.margin.top]);
        
        //Add x and y axes
        svg.append("g").call(d3.axisBottom().scale(xScale))
                        .style("transform", `translateY(${dims.height - dims.margin.bottom}px)`);
        svg.append("g").call(d3.axisLeft().scale(yScale))
                        .style("transform", `translateX(${dims.margin.left}px)`);

        //Add dots
        svg.append("g")
            .selectAll("dot")
            .data(combinedData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(+d["school"]))
            .attr("cy", d => yScale(+d["migration"]))
            .attr("r", 2)
            .attr("fill", "blue");

        //Sort x values
        combinedData.sort((a, b) => {
            return(a["school"] - b["school"]);
        });

        //Add line to points
        svg.append("path")
            .datum(combinedData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(d => +xScale(+d["school"]))
                .y(d => +yScale(+d["migration"]))
            )
    })
})