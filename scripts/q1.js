d3.csv("data/q1_data/q1_data.csv").then((dataset) => {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#q1-viz")
        var container = document.getElementById("q1-container")

        //drawing style
        var colormap = d3.interpolateGreens
        var earthColor = "lightblue"
        var lineColor = "grey"
        var graticuleStroke = 1
        var countryStroke = .75
        var countryStrokeColor = "lightgrey"
        var countryFontSize = .6 * window.width_percentage * container.clientWidth * .05

        //svg dimensions
        var dimensions = {
            width: window.width_percentage * container.clientWidth,
            height: .6 * window.width_percentage * container.clientWidth + 2*countryFontSize,
            margin: {
                top: 10,
                bottom: 50 + countryFontSize,
                right: 10,
                left: 10,
                legend: .5 * window.width_percentage * container.clientWidth 
            }
        }

        //set svg width and height
        svg.attr("height", dimensions.height)
           .attr("width", dimensions.width)

        var data = d3.group(dataset, d => d["Period"])
        var yearsDict = new Map()
        data.forEach((list, year) => {
            var innerDict = new Map()
            for (var country of list) {
                innerDict.set(country["Country"], country)
            }
            yearsDict.set(year, innerDict)
        })

        window.q1dict = yearsDict

        // //colorscale and education accessor
        var educationAccessor = function(dict) {return dict.get(window.selectedPeriod)}
        var countryAccessor = d => d["properties"].ADMIN
        var colorScale = d3.scaleSequential(colormap)
                            .domain(d3.extent(dataset, d => d["SchoolYears"]))

        window.q1colorscale = colorScale

        //map drawing stuff
        var projection = d3.geoEqualEarth()
                           .fitWidth(dimensions.width, {type: "Sphere"})
        var pathGenerator = d3.geoPath(projection)

        //earth background
        var earth = svg.append("path")
                       .attr("id", "map-background")
                       .attr("d", pathGenerator({type: "Sphere"}))
        //long/lat lines
        var graticule = svg.append("path")
                           .attr("id", "map-graticule")
                           .attr("d", pathGenerator(d3.geoGraticule10()))

        //draw in countries
        var countries = svg.append("g")
                           .selectAll(".country")
                           .data(mapdata.features)
                           .enter()
                           .append("path")
                           .attr("class", "country")
                           .attr("d", d => pathGenerator(d))
                           .on("mouseover", function(){
                                highlightCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                            })
                            .on("mouseout", function(){
                                unhighlightCountry(countryAccessor(d3.select(this)["_groups"][0][0]["__data__"]))
                           })
                           .on("click", function(){
                                var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                window.selectedCountry = window.selectedCountry === thisCountry ? null : thisCountry
                                selectCountry()
                           })

        //color in countries
        countries.attr("fill", d => {
                            var countryInfo =  educationAccessor(yearsDict).get(countryAccessor(d));
                            if(countryInfo !== undefined) {
                                return colorScale(countryInfo["SchoolYears"])
                            } else {
                                return "lightgrey"
                            }
                        })
        
        //color legend
        var legend = d3.legendColor()
                       .shapeWidth((dimensions.width-12)/5)
                       .orient("horizontal")
                       .scale(colorScale)
        svg.append("g")
           .style("transform", `translateY(${dimensions.margin.legend}px)`)
           .call(legend)
        var legendSwatches = d3.selectAll(".swatch")
        legendSwatches.attr("height", countryFontSize)
        var legendLabels = d3.selectAll(".label")
                            .attr("font-size", countryFontSize)
        legendLabels = document.getElementsByClassName("label")
        for (var item of legendLabels){
            var ytrans = item.attributes.transform.value.split("(")[1].split(",")[1].split(")")[0] - (countryFontSize)
            var newtrans = item.attributes.transform.value.split(",")[0] + "," + 2*countryFontSize + ")"
            item.attributes.transform.value = newtrans
        }

        //country selected
        var countrySelectedText = svg.append("text")
                                    .attr("id", "countrySelectedText")
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", countryFontSize)
                                    .attr("x", (dimensions.width/2))
                                    .attr("y", dimensions.height - countryFontSize)
                                    .text("Country selected: none")

    })
})