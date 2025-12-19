#!/bin/bash
API_URL="http://localhost:3001/api/simulate-dialogue"

echo "=== TESTING DIALOGUE SIMULATOR PERSONAS (CLAUDE 4.5 SONNET) ==="
echo ""

test_persona() {
    NAME=$1
    FAITH=$2
    TRAITS=$3
    MSG=$4
    
    echo "------------------------------------------------"
    echo "📍 TESTING: $NAME ($FAITH)"
    echo "💬 User says: \"$MSG\""
    echo ""
    
    curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"persona\": {
                \"name\": \"$NAME\",
                \"faith\": \"$FAITH\",
                \"traits\": \"$TRAITS\"
            },
            \"scenario\": \"Meet & Greet\",
            \"userMessage\": \"$MSG\",
            \"conversationHistory\": []
        }" | jq '.'
    echo ""
}

# 1. Islam
test_persona "Brother Ahmed" "Islam" "Warm, community-focused, values hospitality" "As-salamu alaykum, Brother Ahmed. I'm interested in learning about how your community practices its faith."

# 2. Christianity
test_persona "Rev. Sarah" "Christianity" "Theologically minded, gentle, engaging" "Hello Reverend Sarah. I've been curious about the core teachings of your church."

# 3. Judaism
test_persona "Rabbi Cohen" "Judaism" "Analytical, encourages questions, wise" "Shalom Rabbi. I'm here because I want to understand more about Jewish tradition and how you approach scripture."

# 4. Buddhism
test_persona "Monk Tenzin" "Buddhism" "Calm, mindful, direct but kind" "Greetings Monk Tenzin. I would like to learn about the path to mindfulness in your tradition."
