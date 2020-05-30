filePath = 'princeton-grad/product-names.txt'
outputPath = 'princeton-grad/product-ids.txt'

photography_print_options = [
  ["8x10", 29],
  ["11x14", 39],
  ["16x20", 79],
  ["24x30", 149],
]

productIds = []
with open(filePath) as fp:
    line = fp.readline()
    while line:
        # print("Line {}: {}".format(cnt, line.strip()))
        for option in photography_print_options:
            size = option[0]
            productIds.append("%s (%s)" % (line.strip(), size))

        line = fp.readline()

with open(outputPath, 'w') as output:
    output.write(','.join(productIds))
