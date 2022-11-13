d3.csv("data/fertilityRate_final.csv").then((dataset1) =>{
    d3.csv("data/meanyearsdifferencegender25+_final.csv").then((dataset2) => {
        var combinedData = [];
        for(let element1 of dataset1){
            if(combinedData.length > 0 && combinedData[combinedData.length - 1]["country"] == element1["Country"]){
                continue;
            }
        
            for(let element2 of dataset2){
                if (element1["Period"] == element2["Year"] && element1["Period"] == "2015-2020" && element1["Country"] == element2["Country"]) {
                    let newData = {
                        "continent" : element1["Continent"],
                        "country": element1["Country"],
                        "fertility": element1["Rate"],
                        "gap": element2["YearsDifference"]
                    };

                    combinedData.push(newData);

                    break;
                }
            }
        }

        var dimensions = {
            height: 300,
            width: .45 * window.screen.width,
            margin:{
                top: 10,
                bottom: 50,
                right: 10,
                left: 50
            }
        }

        var svg = d3.select("#q2-viz")
            .style("width", dimensions.width)
            .style("height", dimensions.height)

        var xScale = d3.scaleLinear()
                       .domain(d3.extent(combinedData, d => +d["gap"]))
                       .range([dimensions.margin.left,dimensions.width - dimensions.margin.right])

        var yScale = d3.scaleLinear()
                       .domain(d3.extent(combinedData, d => +d["fertility"]))
                       .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

        var continents = [];
        for(let continent of combinedData){
            if(!continents.includes(continent["continent"])){
                let newContinent = continent["continent"]
                continents.push(newContinent)
            }
        }

        function colorForCountry(currentContinet){
            var index = 0
            for(let continent of continents){
                if(continent == currentContinet){
                    return index 
                }
                else{
                    index++
                }
                
            }
        }

        var color = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];
                          
        var points = svg.append("g")
                        .selectAll(".q2-points")
                        .data(combinedData)
                        .enter()
                        .append("circle")
                        .attr("class", "q2-points")
                        .attr("cx", d => xScale(+d["gap"]))
                        .attr("cy", d => yScale(+d["fertility"]))
                        .attr("r", 3)
                        .attr("fill", d => color[colorForCountry(d["continent"])])
        
        var xAxisGen = d3.axisBottom().scale(xScale)

        var xAxis = svg.append("g")
                       .call(xAxisGen)
                       .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`)

        var yAxisGen = d3.axisLeft().scale(yScale)

        var yAxis = svg.append("g")
                       .call(yAxisGen)
                       .style("transform", `translateX(${dimensions.margin.left}px)`)
                       
    })

})