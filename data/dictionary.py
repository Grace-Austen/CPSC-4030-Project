import glob

#Getting country to continent/region relations
continent_paths = glob.glob("..\country_region_continent\continents\scraped\*.txt")
region_paths = glob.glob("..\country_region_continent\\regions\scraped\*.txt")

country_continent_dict = {}
country_region_dict = {}

for continent_path in continent_paths: #for every continent file
    fin = open(continent_path, 'r') 
    lines = fin.readlines()
    continent = '_'.join(continent_path.split('\\')[-1].split('_')[:-1]) #getting continent name to add to dictionary
    for line in lines:
        if(line != '\n'):
            fixed = line.rstrip()
            country_continent_dict[fixed] = continent #add each country under continent in dictionary
    fin.close()

for region_path in region_paths: #for every region file
    fin = open(region_path, 'r') 
    lines = fin.readlines()
    region = '_'.join(region_path.split("\\")[-1].split('_')[:-1]) #getting region name to add to dictionary
    for line in lines:
        if(line != '\n'):
            fixed = line.rstrip()
            country_region_dict[fixed] = region #add each country under region in dictionary
    fin.close()

#As it turns out since only USA and Canada are found in North America, they didn't regionize it, going to add North America to regions
country_region_dict["Canada"] = "North America"
country_region_dict["United States of America"] = "North America"

#Adding the columns continent and region to the data files
data_paths = glob.glob("..\data_only_year_fixed\*.csv")

for file in data_paths: #for every file
    fin = open(file, 'r')
    outfile_path = file.split('\\')[-1].split('_')[0] + "_final.csv"
    #print(outfile_path)
    fout = open(outfile_path, 'w')
    lines = fin.readlines()
    #Add continent and region column headers, strip "" from the headers
    column_headers = lines[0].replace("\"","")
    new_column_headers = column_headers.split(",", 1)
    new_column_headers[0] = 'Country,Continent,Region'
    new_column_headers = ",".join(new_column_headers)
    fout.write(new_column_headers)
    #add the associated continents and regions for each country
    for line in lines[1:]:
        line_strip = line.replace("\"","")
        add_continent_region = line_strip.split(",",1)
        country = add_continent_region[0]
        if(country != "World"):
            add_continent_region = ','.join([country, country_continent_dict[country], country_region_dict[country]]+add_continent_region[1:])
            fout.write(add_continent_region)
    fin.close()
    fout.close()
