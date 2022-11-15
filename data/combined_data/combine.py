import csv

with open("combined.csv", "w", newline="") as combinedFile:
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
    fields = ["Country", "Continent", "Region", "Period", "Age", "Sex", "FertRate", "MigrRate", "LifeYears", "Mean Age", "YearsDifference", "SchoolYears", "MigrNet"]

    #Setup writer and create header with fields
    writer = csv.DictWriter(combinedFile, fieldnames=fields)
    writer.writeheader()

    dictsToWrite = []

    for item in files[5]["data"]:
        dictToWrite = item
        
        if item["Period"] == "2020-2025":
            continue

        for i in range(8):
            if i == 5:
                continue

            for item2 in files[i]["data"]:
                skip = False

                for key in item2.keys():
                    if key in dictToWrite:
                        if item2[key] != dictToWrite[key]:
                            skip = True
                            break

                if skip:
                    continue

                for key in item2.keys():
                    if key not in dictToWrite:
                        dictToWrite.update(item2)

        dictsToWrite.append(dictToWrite)

        writer.writerow(dictToWrite)            

    #Close the csv's
    for i in range(8):
       files[i]["file"].close