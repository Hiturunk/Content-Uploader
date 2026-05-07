 #!/bin/bash

# Set the threshold percentage at which resizing should occur
threshold=80

# Get the disk usage information using the 'df' command
disk_info=$(df -h /data/)

# Extract the used percentage from the disk information
used_percentage=$(echo "$disk_info" | awk 'NR==2 {print $5}' | tr -d '%')

# Compare the used percentage with the threshold
if [ "$used_percentage" -ge "$threshold" ]; then
  echo "Disk usage is above the threshold. Resizing disk..."

  # Replace 'volume_id' with the appropriate volume identifier
  volume_id="vol_d7xkrk7p38o4w2q9"

  # Get the current size of the volume
  current_size=$(flyctl volumes show "$volume_id" | awk '/Size GB: / {print $3}')

  # Replace 'increment_size' with the desired increment size
  increment_size="1"

  # Calculate the new size by adding the increment to the current size
  new_size=$(echo "$current_size + $increment_size" | bc)

  # Resize the volume using 'flyctl volumes extend' command
  flyctl volumes extend "$volume_id" --size="$new_size" -a storage-dev

  echo "Disk resized successfully."
else
  echo "Disk usage is below the threshold. No resizing needed."
fi