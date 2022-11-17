import glob
from typing import Dict

years_school_path = "../meanyearsschooling_final.csv"

dict = {}

fin = open(years_school_path, 'r')
lines = fin.readlines()
for line in lines [1:]:
    vals = line.split(',')
    entry = ','.join(vals[0:4]) #get first 4 country,continent,region,period
    if vals[3] == "2020-2025": #scrub 2020-2025 period
        continue
    if not dict.get(entry, False):
        dict[entry] = [] #for every entry, corresponds to list of years schooling
    dict[entry].append(float(line.split(',')[-1].strip())) #add school year
fin.close()

for key in dict:
    dict[key] = sum(dict[key])/len(dict[key])

#print(dict)

fout = open("q1_data.csv", 'w')
header = ','.join(lines[0].split(',')[0:4])+",SchoolYears\n"
fout.write(header)
for key in dict:
    line = ','.join([key]+[str(dict[key])])
    fout.write(line+"\n")

