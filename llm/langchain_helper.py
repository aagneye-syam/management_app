from langchain.llms import GooglePalm
from dotenv import load_dotenv

load_dotenv()

llm = GooglePalm(google_api_key=["API_KEY"], temperature = 0.9)

paragraph =  llm(input(print("enter some that i can talk to you")))

print(paragraph)