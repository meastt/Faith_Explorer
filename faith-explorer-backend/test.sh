#!/bin/bash
echo "Testing Christianity..."
curl -s -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"religion": "christianity", "question": "What is prayer?"}' | jq -r '.answer' | head -20

echo -e "\n\nTesting Islam..."
curl -s -X POST http://localhost:3001/api/ask \
  -H "Content-Type: application/json" \
  -d '{"religion": "islam", "question": "What is prayer?"}' | jq -r '.answer' | head -20
