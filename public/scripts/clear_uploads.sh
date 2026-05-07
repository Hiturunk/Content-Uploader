#!/bin/bash

folder="/data/uploads"

# Calculate the number of minutes for the age limit (60 minutes in an hour)
age_limit=1440

# Remove files older than the specified age
find "$folder" -type f -mmin +"$age_limit" -delete

echo "Files older than $age_limit minutes in $folder have been removed."
