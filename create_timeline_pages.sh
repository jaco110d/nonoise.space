#!/bin/bash

echo "Creating 8 remaining timeline pages..."
echo "This will take about 2-3 minutes..."

# Function to create a page
create_page() {
    local dir=$1
    local title=$2
    local h1=$3
    local subtitle=$4
    local badge=$5
    
    mkdir -p "$dir"
    
    cat > "$dir/index.html" << 'HTMLTEMPLATE'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE_PLACEHOLDER</title>
    <meta name="description" content="SUBTITLE_PLACEHOLDER">
</head>
<body>
<h1>H1_PLACEHOLDER</h1>
</body>
</html>
HTMLTEMPLATE

    # Replace placeholders
    sed -i '' "s|TITLE_PLACEHOLDER|$title|g" "$dir/index.html"
    sed -i '' "s|H1_PLACEHOLDER|$h1|g" "$dir/index.html"
    sed -i '' "s|SUBTITLE_PLACEHOLDER|$subtitle|g" "$dir/index.html"
    
    echo "✓ Created $dir"
}

echo "Script ready but not executing yet..."

