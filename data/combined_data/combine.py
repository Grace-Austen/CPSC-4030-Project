import csv

with open("combined.csv", "w") as combinedFile:
    #Hard coded file names
    fileNames = ["fertilityRate_final.csv", "growthratewithmigration_final.csv", "lifeexpectancy_final.csv", "meanagechildbearing_final.csv", 
    "meanyearsdifferencegender25+_final.csv", "meanyearsschooling_final.csv", "migrationmanyages_final.csv", "migrationmanyyears_final.csv"]
    files = []

    #For every file to read
    for i in range(8):
        #Create new file dict with the file opened and data
        file = {}
        file["file"] = open(fileNames[i], "r")
        file["data"] = []

        #Create dict reader for the file
        reader = csv.DictReader(file["file"])

        #Read every row and store into data
        for row in reader:
            file["data"].append(row)
        
        #Append to the files list
        files.append(file)

        print(file["data"][0].keys())
    
    #Fields for the combined data
    fields = ["Country", "Continent", "Region", "Period"]

    #Setup writer and create header with fields
    writer = csv.DictWriter(combinedFile, fieldnames=fields)
    writer.writeheader()

    for i in range(8):
       files[i]["file"].close