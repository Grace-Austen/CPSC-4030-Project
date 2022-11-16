import csv

with open("q2.csv", "w", newline="") as writeFile:
    fileNames = ["../meanyearsdifferencegender25+_final.csv", "../fertilityrate_final.csv"]

    file1 = open(fileNames[0], "r")
    file2 = open(fileNames[1], "r")

    reader1 = csv.DictReader(file1)
    reader2 = csv.DictReader(file2)

    data1 = []

    for row in reader1:
        data1.append(row)

    data2 = []

    for row in reader2:
        data2.append(row)

    dicts = []

    for item in data1:
        dictToWrite = item

        if dictToWrite["Period"] == "2020-2025":
            continue

        for item2 in data2:
            skip = False

            for key in item2.keys():
                if key in dictToWrite:
                    if item2[key] != dictToWrite[key]:
                        skip = True
                        break
            
            if skip:
                continue

            dictToWrite.update(item2)

        dicts.append(dictToWrite)

    fields = ["Country", "Continent", "Region", "Period", "YearsDifference", "Rate"]

    writer = csv.DictWriter(writeFile, fieldnames=fields)
    writer.writeheader()

    for dict in dicts:
        writer.writerow(dict)

    file1.close()
    file2.close()