import json

from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
        
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # print(self.scope)
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # receive message from websocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]
        # send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message, "username": username}
        )
    
    # receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        # send message to Websocket
        await self.send(text_data=json.dumps({"message": message, "username": username}))
