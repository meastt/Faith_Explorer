#!/bin/bash

# Test script for the Dialogue Simulator API
# This script tests the /api/simulate-dialogue endpoint

API_URL="${API_URL:-http://localhost:3001}"

echo "🧪 Testing Faith Explorer Dialogue Simulator API"
echo "================================================"
echo "API URL: $API_URL"
echo ""

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$API_URL/health")
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    exit 1
fi
echo ""

# Test 2: Dialogue Simulation
echo "2️⃣ Testing dialogue simulation endpoint..."
DIALOGUE_RESPONSE=$(curl -s -X POST "$API_URL/api/simulate-dialogue" \
    -H "Content-Type: application/json" \
    -d '{
        "persona": {
            "id": "jewish",
            "name": "Rabbi Cohen",
            "faith": "Judaism",
            "traits": "Analytical, encourages questions, wise",
            "avatar": "✡️",
            "color": "#2563eb"
        },
        "scenario": "Meet & Greet",
        "userMessage": "Hello Rabbi, it is nice to meet you!",
        "conversationHistory": []
    }')

echo "Response: $DIALOGUE_RESPONSE"
echo ""

# Check if response contains expected fields
if echo "$DIALOGUE_RESPONSE" | grep -q '"reply"'; then
    echo "✅ Dialogue API returned 'reply' field"
else
    echo "❌ Dialogue API missing 'reply' field"
fi

if echo "$DIALOGUE_RESPONSE" | grep -q '"feedback"'; then
    echo "✅ Dialogue API returned 'feedback' field"
else
    echo "❌ Dialogue API missing 'feedback' field"
fi

if echo "$DIALOGUE_RESPONSE" | grep -q '"score"'; then
    echo "✅ Dialogue API returned 'score' field"
else
    echo "❌ Dialogue API missing 'score' field"
fi

# Check for error
if echo "$DIALOGUE_RESPONSE" | grep -q '"error"'; then
    echo "⚠️ Warning: Response contains an error field"
    echo ""
fi

echo ""
echo "================================================"
echo "🏁 Dialogue API test completed!"
echo ""
echo "If you see all ✅ marks above, the dialogue API is working correctly."
echo "If you see ❌ marks, check the server logs for errors."
