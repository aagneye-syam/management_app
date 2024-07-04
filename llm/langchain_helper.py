from langchain.llms import GooglePalm
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.environ["API_KEY"]

llm = GooglePalm(google_api_key=api_key, temperature=0.9)

paragraph = llm(input("Enter something you want to talk about: "))

print(paragraph)
