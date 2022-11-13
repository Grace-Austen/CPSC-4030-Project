import glob
from typing import Dict

life_expectancy_path = "../lifeexpectancy_final.csv"
years_school_path = "../meanyearsschooling_final.csv"
fertility_rate_path = "../fertilityRate_final.csv"

paths = [life_expectancy_path, years_school_path]

dict = {}

fin = open(life_expectancy_path, 'r')
lines = fin.readlines()
for line in lines[1:]:
    entry = ','.join(line.split(',')[0:4])
    if entry[-1] == "2020-2025":
        continue
    if not dict.get(entry, False):
        dict[entry] = [[], [], []] #life expectancy, years schooling, fertility
    dict[entry][0].append(float(line.split(',')[-1].strip()))
fin.close()

fin = open(years_school_path, 'r')
lines = fin.readlines()
for line in lines[1:]:
    entry = ','.join(line.split(',')[0:4])
    if not dict.get(entry, False):
        dict[entry] = [[], [], []] #life expectancy, years schooling, fertility
    dict[entry][1].append(float(line.split(',')[-1].strip()))
fin.close()

fin = open(fertility_rate_path, 'r')
lines = fin.readlines()
for line in lines[1:]:
    entry = ','.join(line.split(',')[0:4])
    if not dict.get(entry, False):
        dict[entry] = [[], [], []] #life expectancy, years schooling, fertility
    dict[entry][2].append(float(line.split(',')[-1].strip()))
fin.close()

dict2 = {}
for key in dict:
    if "2025" in key:
        continue
    len_life = len(dict[key][0])
    len_school = len(dict[key][1])
    len_fertility = len(dict[key][2])
    if(len_life*len_school*len_fertility != 0):
        dict2[key] = [sum(dict[key][0])/len_life, sum(dict[key][1])/len_school, sum(dict[key][2])/len_fertility]

print(dict2)
#print(len(dict2))

fout = open("q3_data.csv", 'w')
header = ','.join(lines[0].split(',')[0:4])+",Life Expectancy,Years School,Fertility Rate\n"
fout.write(header)
for key in dict2:
    vals = []
    for val in dict2[key]:
        vals.append(str(val))
    line = ','.join([key]+vals)
    fout.write(line+"\n")

