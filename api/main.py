import subprocess # take inputs here
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route('/', methods=['POST'])
def hello_world():
    if request.is_json:
        data = request.get_json()  # Get the JSON data from the request
        json_string = json.dumps(data)  
        #print(json_string)
        while True:
            process = subprocess.Popen(f"python3 compute.py \'{json_string}\'", stdout=subprocess.PIPE,stderr=subprocess.PIPE, text=True, shell=True)
            try:
                process.wait(timeout=0.2)  # Waits for 5 seconds
                break
            except subprocess.TimeoutExpired:
                process.kill()  # Kill the process if timeout occurs
                print("Process timed out and was killed")
        stdout, stderr = process.communicate()
        print("Output:")
        print(stdout)
        if stdout == "Invalid table":
            return jsonify({"error": "Invalid input"}), 400
        sending_data = json.loads(stdout)
        return jsonify(sending_data), 200
    else:
         return jsonify({"error": "Request was not JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
