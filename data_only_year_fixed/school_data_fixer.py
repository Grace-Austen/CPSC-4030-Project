import glob

outfile_path = 'meanyearsschooling_data_only_fixed.csv'

path = 'meanyearsschooling_data_only.csv'

count = 0

fout = open(outfile_path, 'w')

fin = open(path, 'r')

print(fin)

Lines = fin.readlines()

for line in Lines:
    newline = line.split(',')
    newline[1] = newline[1] + '-'+str(int(newline[1])+5)
    fout.write(','.join(newline))

fin.close()
fout.close()

print("success")