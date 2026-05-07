import sys
import json

if len(sys.argv) < 5:
    print("Insufficient arguments provided.")
    print("Usage: python generate_json_no_traits.py <cid_hash_image> <name> <description> <supply> <external_url>")
    sys.exit(1)

cid_hash_image = sys.argv[1]
name = sys.argv[2]
description = sys.argv[3]
supply = int(sys.argv[4])
url = sys.argv[5]

metadata = []

for x in range(1, supply + 1):
    dictionary = {
        "name": name + "#" + str(x),
        "description": description,
        "external_url": url,
        "image": "ipfs://" + cid_hash_image + "/" + str(x),
    }

    metadata.append(dictionary)

# Convert metadata list to JSON and print the JSON array
print(json.dumps(metadata, indent=4))
