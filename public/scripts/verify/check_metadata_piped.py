import sys
import os
import json

# Get the path to the directory containing the JSON files from the command-line argument
path_to_json_files = sys.argv[1]

# Loop through each file in the directory
for filename in os.listdir(path_to_json_files):
    # Check if the file is a JSON file
    if filename.endswith(".json"):
        # Load the file as a JSON object
        with open(os.path.join(path_to_json_files, filename), "r", encoding="utf-8") as f:
            json_data = json.load(f)

        # Extract the expected number from the filename
        expected_num = filename.split(".")[0]

        # Check if the numbers match in the "name" property
        if expected_num not in json_data.get("name", ""):
            # Print a message indicating the mismatch
            print(f"Error: Filename {filename} does not match name field in JSON object.")

        # Check if the numbers match in the "image" property
        if expected_num not in json_data.get("image", ""):
            # Print a message indicating the mismatch
            print(f"Error: Filename {filename} expected image number {expected_num}, but found {json_data['image']}")
