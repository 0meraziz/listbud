#!/bin/bash

# Test script for delete all functionality
echo "Testing Delete All Places functionality..."

# Get auth token (you'll need to replace with actual token)
# TOKEN="your_jwt_token_here"

# Test the delete all endpoint
echo "Testing DELETE /api/places endpoint..."
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:5000/api/places

echo ""
echo "Delete all test completed!"
