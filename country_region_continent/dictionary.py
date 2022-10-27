import glob

continent_paths = glob.glob("continents/scraped/*.txt")
region_paths = glob.glob("regions/scraped/*.txt")

continent_country_dict = {}
region_country_dict = {}

countries_from_cont = []
countries_from_region = []

for continent_path in continent_paths: #for every continent file
    fin = open(continent_path, 'r') 
    lines = fin.readlines()
    continent = '_'.join(continent_path.split('/')[-1].split('_')[:-1]) #getting continent name to add to dictionary
    continent_country_dict[continent] = []
    for line in lines:
        if(line != '\n'):
            fixed = line.rstrip()
            continent_country_dict[continent].append(fixed) #add each country under continent in dictionary
            countries_from_cont.append(line) #checking validity
    fin.close()

for region_path in region_paths: #for every region file
    fin = open(region_path, 'r') 
    lines = fin.readlines()
    region = '_'.join(region_path.split('/')[-1].split('_')[:-1]) #getting region name to add to dictionary
    region_country_dict[region] = []
    for line in lines:
        if(line != '\n'):
            fixed = line.rstrip()
            region_country_dict[region].append(fixed) #add each country under region in dictionary
            countries_from_region.append(line) #checking validity
    fin.close()

#As it turns out since only USA and Canada are found in North America, they didn't regionize it, going to add North America to regions
region_country_dict["North America"] = ["Canada\n", "United States of America\n"]

print("Num countries from continents: %d" % len(countries_from_cont))
print("Num countries from regions: %d" % len(countries_from_region))

countries_from_cont.sort()
countries_from_region.sort()

fout_cont = open("cont.txt", 'w')
fout_reg = open("reg.txt", 'w')

for item in countries_from_cont:
    fout_cont.write(item)

for item in countries_from_region:
    fout_reg.write(item)

print(continent_country_dict)
print(region_country_dict)