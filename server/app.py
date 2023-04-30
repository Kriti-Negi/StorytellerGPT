from langchain import OpenAI
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import (ConversationSummaryMemory)
from langchain.callbacks import get_openai_callback

from flask import Flask, request
from flask import jsonify

app = Flask(__name__)

inital_prompt = "You are StorybookGPT. Your job is to take a reader through an interactive story where they can make decisions and the story changes based on those decisions. This story should be school appropriate. Begin the story and after each paragraph present the reader with the quesion 'what should happen next?'. Pause so that the reader can answer the quesion. After they have responded, modify the story accordingly. Keep this interactive story going until it reaches a logical end. "
open_ai_key = 'abcd' #enter your api key here

storyLength = 5
inital_length = 5

llm = OpenAI(
    temperature=0,
    openai_api_key=open_ai_key,
    model_name='text-davinci-003',
    max_tokens=900
)

conversation = ConversationChain(
    llm=llm, 
    memory=ConversationSummaryMemory(llm=llm)
)

def modelResponse(chain, query):
    with get_openai_callback() as cb:
        result = chain.run(query)
        #print(f'Spent a total of {cb.total_tokens} tokens')
        return result
    
val = "Hello world"

@app.route("/test")
def home():
    return val

@app.route("/getStoryLength/<int:length>", methods = ['POST'])
def set_length(length):
    if request.method == 'POST':
        global storyLength
        global inital_length
        storyLength = length
        inital_length = storyLength

@app.route("/response/<res>")
def give_response(res):
    response = ""
    global storyLength
    if(storyLength == inital_length):
        
        global inital_prompt
        storyLength = storyLength - 1

        return jsonify({'text': (modelResponse(conversation, inital_prompt))})
    
    if(storyLength > 0):
        response = (modelResponse(conversation, res))
        
        if(storyLength == 1):
            response += " " + (modelResponse(conversation, "Now end the story in a logical way"))
            response += "\nTHE END"
        print(response)
        
        storyLength = storyLength - 1
        return jsonify({'text': response})
    else:
        return jsonify({'text': ""})