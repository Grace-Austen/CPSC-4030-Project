import csv

with open("q4.csv", "w", newline="") as writeFile:
    fileNames = ["../meanyearsschooling_final.csv", "../migrationmanyyears_final.csv"]

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
    
    for item in dicts:
        sumYears = float(item["Years"])
        sumNet = float(item["Net"])
        count = 1

        for item2 in dicts:
            if item == item2:
                continue

            if item["Country"] == item2["Country"] and item["Period"] == item2["Period"]:
                count += 1
                sumYears += float(item2["Years"])
                sumNet += float(item2["Net"])

                dicts.remove(item2)

        item["Years"] = sumYears / count
        item["Net"] = sumNet / count

        item.pop("Age")
        item.pop("Sex")

    fields = ["Country", "Continent", "Region", "Period", "Years", "Net"]

    writer = csv.DictWriter(writeFile, fieldnames=fields)
    writer.writeheader()

    for dict in dicts:
        writer.writerow(dict)

    file1.close()
    file2.close()