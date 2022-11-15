
d3.csv("data/combined_data/combined.csv").then(function(dataset) {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#q1-viz")
        var container = document.getElementById("q1-viz-table")

        var width_percentage = 0.5

        //svg dimensions
        var dimensions = {
            width: width_percentage * container.clientWidth,
            height: .6 * width_percentage * container.clientWidth,
            margin: {
                top: 10,
                bottom: 100,
                right: 10,
                left: 10,
                legend: .5 * width_percentage * container.clientWidth 
            }
        }

        //drawing style
        var colormap = d3.interpolateGreens
        var earthColor = "lightblue"
        var lineColor = "grey"
        var graticuleStroke = 1
        var countryStroke = .75
        var countrySelectLineColor = "dimgrey"
        var countryFontSize = 30

        //set svg width and height
        svg.attr("height", dimensions.height)
           .attr("width", dimensions.width)

        //data manip 2
        var data = d3.group(dataset, d => d["Period"])
        var yearsDict = new Map()
        data.forEach((list, year) => {
            yearsDict.set(year, d3.rollup(list, v => d3.mean(v, d => d["SchoolYears"]), d => d["Country"]))
        })

        window.q1dict = yearsDict

        //colorscale and education accessor
        var educationAccessor = function(dict) {return dict.get(window.selectedPeriod).values()}
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
                       .attr("fill", earthColor)
        //long/lat lines
        var graticule = svg.append("path")
                           .attr("id", "map-graticule")
                           .attr("d", pathGenerator(d3.geoGraticule10()))
                           .attr("stroke", lineColor)
                           .attr("stroke-width", graticuleStroke)
                           .attr("fill", "none")

        //draw in countries
        var countries = svg.append("g")
                           .selectAll(".country")
                           .data(mapdata.features)
                           .enter()
                           .append("path")
                           .attr("class", "country")
                           .attr("d", d => pathGenerator(d))
                           .attr("stroke", lineColor)
                           .attr("stroke-width", countryStroke)
                           .on("mouseover", function(){
                                window.selectedCountry = d3.select(this)["_groups"][0][0]["__data__"]["properties"].ADMIN
                                d3.select(this)
                                  .attr("stroke", countrySelectLineColor)
                                  .attr("stroke-width", window.selectStroke)
                                  countrySelectedText.text("Country selected: " + window.selectedCountry)
                                selectCountry()
                                //console.log(d3.select(this))
                            })
                            .on("mouseout", function(){
                                window.selectedCountry = null
                                d3.select(this)
                                  .attr("stroke", lineColor)
                                  .attr("stroke-width", countryStroke)
                                countrySelectedText.text("Country selected: none")
                                deselectCountry()
                           })

        //color in countries
        countries.attr("fill", d => colorScale(yearsDict.get(window.selectedPeriod).get(d.properties.ADMIN)))
        
        //color legend
        var legend = d3.legendColor()
                       .shapeWidth((dimensions.width-12)/5)
                       .orient("horizontal")
                       .scale(colorScale)
        svg.append("g")
           .style("transform", `translateY(${dimensions.margin.legend}px)`)
           .call(legend)

        //country selected
        var countrySelectedText = svg.append("text")
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", countryFontSize)
                                    .attr("x", (dimensions.width/2))
                                    .attr("y", dimensions.height - countryFontSize)
                                    .text("Country selected: none")

    })
})