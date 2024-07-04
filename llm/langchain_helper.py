from langchain.llms import GooglePalm
from dotenv import load_dotenv
import os 

load_dotenv()

os.environ("API_KEY")

llm = GooglePalm(google_api_key=os.environ, temperature = 0.9)

paragraph =  llm(input("enter some that i can talk to you"))

print(paragraph)