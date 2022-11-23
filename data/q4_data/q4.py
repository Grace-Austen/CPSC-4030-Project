import glob
from typing import Dict

'''
Want csv like:
Country, Continent, Region, Period, SchoolYears, LifeYears, Fertility, MigrNet, YearsDifference
'''

school_path = "../meanyearsschooling_final.csv"
life_path = "../lifeexpectancy_final.csv"
fert_path = "../fertilityRate_final.csv"
migr_path = "../migrationmanyyears_final.csv"
diff_path = "../meanyearsdifferencegender25+_final.csv"

paths = [school_path, life_path, fert_path, migr_path, diff_path]
dict = {}
data_types = []
for path in paths:
    data_type = path.split('/')[1].split("_final")[0]
    data_types.append(data_type)
    fin = open(path, 'r')
    lines = fin.readlines()
    for line in lines[1:]:
        sv = line.split(',')
        entry = ','.join(sv[0:4]) #country,cont,region,period
        if sv[3] == "2020-2025": #don't want to include this period, not all attr have this data
            continue
        if not dict.get(entry, False):
            dict[entry] = {} #set up a dictionary to map to
        if not dict[entry].get(data_type):
            dict[entry][data_type] = []
        dict[entry][data_type].append(float(sv[-1]))
    fin.close()

dict2 = {}

for key in dict:
    innerDict = {}
    for data_type in data_types:
        innerDict[data_type] = sum(dict[key][data_type])/len(dict[key][data_type]) if dict[key].get(data_type, False) != False else "NaN"
    dict2[key] = innerDict

fout = open("q4_v0.csv", 'w')
fout.write("Country,Continent,Region,Period,SchoolYears,LifeYears,Fertility,MigrNet,YearsDifference")
for key in dict2:
    vals = []
    #want to make sure order is preserved
    vals.append(str(dict2[key]["meanyearsschooling"]))
    vals.append(str(dict2[key]["lifeexpectancy"]))
    vals.append(str(dict2[key]["fertilityRate"]))
    vals.append(str(dict2[key]["migrationmanyyears"]))
    vals.append(str(dict2[key]["meanyearsdifferencegender25+"]))
    line = ','.join([key]+vals)
    fout.write(line+"\n")

fout.close()

dict3 = {}
for key in dict:
    innerDict = {}
    valid = True
    for data_type in data_types:
        if dict[key].get(data_type, False) != False:
            innerDict[data_type] = sum(dict[key][data_type])/len(dict[key][data_type])
        else:
            valid = False
    if(valid):
        dict3[key] = innerDict

fout = open("q4.csv", 'w')
fout.write("Country,Continent,Region,Period,SchoolYears,LifeYears,Fertility,MigrNet,YearsDifference")
for key in dict3:
    vals = []
    #want to make sure order is preserved
    vals.append(str(dict3[key]["meanyearsschooling"]))
    vals.append(str(dict3[key]["lifeexpectancy"]))
    vals.append(str(dict3[key]["fertilityRate"]))
    vals.append(str(dict3[key]["migrationmanyyears"]))
    vals.append(str(dict3[key]["meanyearsdifferencegender25+"]))
    line = ','.join([key]+vals)
    fout.write(line+"\n")

fout.close()