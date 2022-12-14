import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from chatswap.models import message as messageModel
from django.utils import timezone


#Class that instantiates a socket client and interfaces between the websocket and the front-end javascript for recieving messages.
#Also connects client to the redis server that takes all channels(users) and groups them to one io stream.
class ChatUser(WebsocketConsumer):
    def connect(self):
        self.group = "chat_" #% self.scope["url_route"]["kwargs"]
        async_to_sync(self.channel_layer.group_add)(
            self.group, self.channel_name
        )

        self.accept()
    
    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group, self.channel_name
        )
    
    #Calls chatMessage() or vote() with async_to_sync() with the group send parameter and then passes in the subsequent data definition
    # of "message" and "username" to the event parameter as a dictionary, which then defines how it should be sent with the self.send() method.
    #If it is a vote that is being sent, it adds the up vote or downvote to the corresponding message's model and then sends it to the websocket group
    # via vote()
    def receive(self, text_data):
        textJSON = json.loads(text_data)
        
        try:
            text = textJSON["message"]
            username = textJSON["username"]

            message = messageModel(text=text, username=username, upVotes=0, downVotes=0, messageTime=timezone.now())
            message.save()
            messageId = message.id
        except Exception as e:
            text = None
            username = None
            print(str(e) + " exception 1")

        try:
            vote = textJSON["vote"]
            voteMessageId = textJSON["id"]
        except Exception as e:
            vote = None
            voteMessageId = None
            print(str(e) + " exception 2")


        #These statements rely on the above try except statements, which depending on which type of data string they receive from
        #a javascript client (either a chat or vote), will throw an excepction due to not having a dictionary definition for a it
        #is trying to pull from textJSON, if it gets an exception it will set those variables to null which determines which of the
        #following statements is used.

        #Used for chat messages
        if (text != None and text != ""):
            async_to_sync(self.channel_layer.group_send)(
                self.group, {"type": "chatMessage", "message": text, "username": username, "id": str(messageId)}
            )
        #Used for votes
        elif (vote != None):
            votedMessage = messageModel.objects.get(id = voteMessageId)
            print(votedMessage)
            print(vote)

            if (vote == "up"):
                votedMessage.upVotes += 1
            if (vote == "down"):
                votedMessage.downVotes += 1
            
            async_to_sync(self.channel_layer.group_send)(
                self.group, {"type": "vote", "id": voteMessageId, "vote": vote}
            )
            votedMessage.save()

    def chatMessage(self, event):
        text = event["message"]
        username = event["username"]
        id = event["id"]
        self.send(text_data=json.dumps({"type" : "chat", "message": text, "username": username, "id": id}))

    def vote(self, event):
        vote = event["vote"]
        id = event["id"]
        self.send(text_data=json.dumps({"type" : "vote", "vote": vote, "id": id}))
    
