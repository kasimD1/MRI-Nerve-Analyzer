import sys
import json

def analyze_mri(data):
    try:
        # Extract values with safe defaults
        # We use float() for everything to ensure decimal precision
        age = float(data.get('age', 0))
        pain_level = float(data.get('painLevel', 0))
        area = float(data.get('foraminalArea', 0))

        # --- DATA VALIDATION ---
        # If the area is 0, it likely means the input didn't reach Python correctly
        if area == 0 and age == 0:
            return {
                "prediction": "Waiting for Input...",
                "status": "idle",
                "indicator": "gray",
                "recommendation": "Please enter patient metrics above."
            }

        # --- UPDATED LOGIC ---
        # We prioritize the Physical Measurement (Area) first
        if area > 0 and area < 40:
            result = "Severe Nerve Compression"
            color = "red"
            rec = "Consult with a neurosurgeon for further imaging."
        elif 40 <= area <= 70:
            result = "Moderate Nerve Compression"
            color = "orange"
            rec = "Monitor with physical therapy and follow-up MRI."
        elif area > 70:
            result = "Mild Nerve Compression"
            color = "green"
            rec = "Routine monitoring and conservative management."
        else:
            # Fallback for edge cases
            result = "Analysis Inconclusive"
            color = "blue"
            rec = "Ensure all patient data is entered correctly."

        return {
            "prediction": result,
            "status": "success",
            "indicator": color,
            "recommendation": rec
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    try:
        # Read the JSON string sent from Node.js
        raw_input = sys.stdin.read()
        
        if not raw_input.strip():
            # If Node.js sent nothing, don't crash, just return a prompt
            print(json.dumps({"prediction": "No data received", "indicator": "gray"}))
        else:
            input_data = json.loads(raw_input)
            prediction_result = analyze_mri(input_data)
            print(json.dumps(prediction_result))
            
    except Exception as e:
        print(json.dumps({"status": "error", "message": f"Python Script Error: {str(e)}"}))