//Open both csv's and combine data
d3.csv("../data/migrationmanyyears_final.csv").then((dataset1) => {
    d3.csv("../data/meanyearsschooling_final.csv").then((dataset2) => {
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
                if (element1["Period"] == element2["Period"] && element1["Country"] == element2["Country"]) {
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
        
        console.log(combinedData);

        //Select the svg we will be using
        var svg = d3.select("q4-viz");


    })
})