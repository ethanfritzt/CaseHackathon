import requests
import script_writer

# Define the API URL (replace this with the actual API endpoint for Generative Manim)
url = 'https://api.generativemanim.com/render'

script_writer.write_script()
manim_requests = script_writer.getRequests()
for request in manim_requests:
    prompt = {
        "prompt": "Starting at the top-left of the screen, generate a video for: " + request
    }

    # Send the POST request to the Generative Manim API
    response = requests.post(url, json=prompt)

    # Check if the request was successful
    if response.status_code == 200:
        # Get the response (which could be a URL to the rendered animation, or the animation file)
        print("Success! Animation is being rendered.")
        print(response.json())  # or response.text depending on the response format
    else:
        print(f"Failed to send prompt. Status code: {response.status_code}")
        print(response.text)