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

    #Array to store all the country dicts
    dictsToWrite = []

    #For every item in the first file (biggest list of keys)
    for item in files[5]["data"]:
        dictToWrite = item
        
        #Skip 2020-2025 bc a lot dont have values
        if item["Period"] == "2020-2025":
            continue
        
        #For every other file
        for i in range(8):
            if i == 5:
                continue
            
            #For every item in the other file
            for item2 in files[i]["data"]:
                skip = False

                #For every key in that item, if it is in the dict already and is not equal, skip to next item
                for key in item2.keys():
                    if key in dictToWrite:
                        if item2[key] != dictToWrite[key]:
                            skip = True
                            break

                if skip:
                    continue
                
                #For every key that is not in the dict, update the dict with it
                for key in item2.keys():
                    if key not in dictToWrite:
                        dictToWrite.update(item2)

        #Append the dict to the array
        dictsToWrite.append(dictToWrite)

    #Write to the file
    for item in dictsToWrite:
        writer.writerow(item)

    #Close the csv's
    for i in range(8):
       files[i]["file"].close