#!/bin/bash

# List of target architectures
architectures=("amd64" "arm" "arm64")

# List of target operating systems
operating_systems=("linux" "darwin" "windows")

# Clean build output directory
rm -rf "dist"

# Loop through architectures
for arch in "${architectures[@]}"; do
  # Loop through operating systems
  for os in "${operating_systems[@]}"; do
    # Set the build output filename
    output_name="$project_name-$os-$arch"

    # Build the project
    env GOOS="$os" GOARCH="$arch" go build -o "dist/$os-$arch"

    # Check if the build was successful
    if [ $? -eq 0 ]; then
      echo "Build for $os-$arch completed successfully!"
    else
      echo "Build for $os-$arch failed!"
    fi
  done
done
