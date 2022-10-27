import glob

paths = glob.glob("*_raw.txt")

for path in paths:
    outfile_path = "scraped/" + '_'.join(path.split('_')[:-1]) + "_scraped.txt"
    fout = open(outfile_path, 'w')
    fin = open(path, 'r')

    line = fin.readlines()[0]
    split_1 = line.split('">')[2:]
    for item in split_1:
        country = item.split("<")[0]
        fout.write(country+"\n")
    fin.close()
    fout.close()
    

'''
outfile_path = 'africa_scraped.txt'
path = 'africa.txt'
fout = open(outfile_path, 'w')
fin = open(path, 'r')

line = fin.readlines()[0]
split_1 = line.split('">')

for item in split_1:
    country = item.split("<")[0]
    fout.write(country+'\n')
    '''

print("success")