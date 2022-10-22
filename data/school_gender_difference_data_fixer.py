import glob

outfile_path = 'meanyearsdifferencegender25+_data_only_fixed.csv'

path = 'meanyearsdifferencegender25+_data_only.csv'

try:
    open(outfile_path, mode='x')
except(Exception) as e:
    pass

fout = open(outfile_path, 'w')

fin = open(path, 'r')

print(fin)

Lines = fin.readlines()[1:]

for line in Lines:
    newline = line.split(',')
    newline[1] = newline[1] + '-'+str(int(newline[1])+5)
    fout.write(','.join(newline))

fin.close()
fout.close()

print("success")