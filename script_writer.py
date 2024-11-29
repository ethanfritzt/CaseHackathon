import os
import openai
from dotenv import load_dotenv, dotenv_values 

load_dotenv()

openai.api_key = os.getenv("api_key")

requests = [] #contains every individual prompt to feed into Manim

def getRequests():
    return requests

#the method prompting ChatGPT
def generate(level, prompt):
    completion = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professor on Khan Academy teaching a five-minute lesson."},
            {"role": "system", "content": "You speak at a "+level+" level."},
            {"role": "system", "content": "You use lots of examples."},
            {"role": "user", "content": prompt},
        ],
    )
    return completion.choices[0].message.content

def write_script():
    #prompt user for input
    level = input("What is your current education/professional level? ")
    prompt_message = input("What concept would you like explained? ")

    try:
        # Call the generate() function to get the script
        script = generate(level, "Explain " + prompt_message) #THE VARIABLE CONTAINING THE SCRIPT

        if not script or not isinstance(script, str):
            raise ValueError("Failed to generate a script. Please try again.")
    
    except Exception as e:
        print(f"Error generating script: {e}")
        return

    i = 0
    while (i < len(script)):
        section = []
        while (i < len(script) and script[i] != "\n"):
            section.append(script[i])
            i += 1
        section = ''.join(section)
        requests.append(section)
        print(section)
        i += 1
