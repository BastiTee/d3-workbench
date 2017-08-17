#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Convert CSV chord input to necessary matrix."""
from csv import reader, DictReader
from re import sub


def get_index(key, keys):
    for i in range(0, len(keys)):
        if key == keys[i]:
            return i
    return None


# step 1: read all keys
keys = []
for row in DictReader(
        open('data.csv', 'r', encoding='utf-8'), delimiter=','):
    keys.append(row['left'])
    keys.append(row['right'])
keys = sorted(list(set(keys)))

# step 2: initialize matrix
matrix = []
for i in range(0, len(keys)):
    m = []
    for j in range(0, len(keys)):
        m.append(0)
    matrix.append(m)

# step 3: fill matrix
for row in DictReader(
        open('data.csv', 'r', encoding='utf-8'), delimiter=','):
    idx_left = get_index(row['left'], keys)
    idx_right = get_index(row['right'], keys)
    matrix[idx_left][idx_right] = int(row['count'])
    # print('{}-{}'.format(idx_left, idx_right))

# step 4: create output files
out = sub('], \[', '],\n[', str(matrix))
ofile = open('matrix.json', 'w')
ofile.write(out)
ofile.close()
keys = '\n'.join(['key'] + keys)
ofile = open('keys.csv', 'w')
ofile.write(keys)
ofile.close()
