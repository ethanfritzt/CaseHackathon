import os
import openai
from dotenv import load_dotenv, dotenv_values 

load_dotenv() 

openai.api_key = os.getenv("api_key")

def write_script(level, prompt):
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

#prompt user for input
level = input("What is your current education/professional level? ")
prompt_message = input("What concept would you like explained? ")
script = write_script(level,"Explain "+prompt_message) #THE VARIABLE CONTAINING THE SCRIPT

print(script) #print the string for testing purposes