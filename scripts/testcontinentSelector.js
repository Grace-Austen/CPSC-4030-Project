d3.csv("data/q1_data/q1_data.csv").then((dataset) => {
    d3.json("data/map.json").then(function(mapdata) {

        //get relevant elements
        var svg = d3.select("#newMap")
        var container = document.getElementById("newMapContainer")

        //drawing style
        var width_percentage = .75
        var colormap = d3.interpolateGreens
        var countryStroke = .75


        //svg dimensions
        var dimensions = {
            width: width_percentage * container.clientWidth,
            height: .45 * width_percentage * container.clientWidth,
            margin: {
                top: 10,
                bottom: 50,
                right: 10,
                left: 10,
                legend: .5 * width_percentage * container.clientWidth 
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
        console.log(yearsDict)

        window.q1dict = yearsDict

        // //colorscale and education accessor
        var countryAccessor = d => d["properties"].ADMIN
        var continentAccessor = d => d["properties"].CONTINENT

        //map drawing stuff
        var projection = d3.geoEqualEarth()
                           .fitWidth(dimensions.width, {type: "Sphere"})
        var pathGenerator = d3.geoPath(projection)

        //draw in countries
        var countries = svg.append("g")
                           .selectAll(".continent_countries")
                           .data(mapdata.features)
                           .enter()
                           .filter(d => countryAccessor(d) !== "Antarctica")
                           .append("path")
                           .attr("class", "continent_countries")
                           .attr("d", d => pathGenerator(d))
                           .attr("stroke", "none")
                           .attr("stroke-width", countryStroke)
                           .on("mouseover", function(){
                                var currentContinent = continentAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                                if(currentContinent == "North America"){
                                    currentContinent = "North_America"
                                }
                                else if(currentContinent == "South America"){
                                    currentContinent = "Latin_America_and_the_Carribean"
                                }
                                highlightContinent(currentContinent)
                            })
                        //     .on("mouseout", function(){
                        //         var currentContinent = continentAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                        //         if(currentContinent == "North America"){
                        //             currentContinent = "North_America"
                        //         }
                        //         else if(currentContinent == "South America"){
                        //             currentContinent = "Latin_America_and_the_Carribean"
                        //         }
                        //         unhighlightContinent(currentContinent)
                        //    })
                        //    .on("click", function(){
                        //         var thisCountry = countryAccessor(d3.select(this)["_groups"][0][0]["__data__"])
                        //         window.selectedCountry = window.selectedCountry === thisCountry ? null : thisCountry
                        //         setCountry()
                        //    })

        //color in countries
        countries.attr("fill", d => {
                                var currentContinent = continentAccessor(d)
                                if(currentContinent == "North America"){
                                    currentContinent = "North_America"
                                }
                                else if(currentContinent == "South America"){
                                    currentContinent = "Latin_America_and_the_Carribean"
                                }
                                return window.continent_color_dict[currentContinent]
                        })
    })
})