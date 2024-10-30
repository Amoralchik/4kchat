import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  typingClient = [];

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll(@MessageBody('chatId') chatId: number) {
    return this.messagesService.findAll(chatId);
  }

  @SubscribeMessage('updateMessage')
  async update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesService.update(
      updateMessageDto.id,
      updateMessageDto,
    );

    this.server.emit('updatedMessage', message);

    return message;
  }

  @SubscribeMessage('removeMessage')
  async remove(@MessageBody() removeMessage: { id: number }) {
    const message = await this.messagesService.remove(removeMessage);

    this.server.emit('removedMessage', message);

    return message;
  }

  @SubscribeMessage('typing')
  typing(
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('chatId') chatId: number,
    @MessageBody('typingCounter') typingCounter: number,
    @MessageBody('name') name: string,
  ) {
    /** to prevent flickering (server.emit sending with and without user at the same time)
     * when user start typing, comeback, or continues to write
     * after ending first setTimeout we uses typingCounter */
    const client = this.typingClient.find((c) => c.name === name);

    if (!client?.name) {
      this.typingClient.push({ name, chatId, isTyping, typingCounter });
    } else {
      client.typingCounter = typingCounter;
    }
    this.server.emit('typing', this.typingClient);
    setTimeout(() => {
      if (!client) return;
      if (client.typingCounter !== typingCounter) return;
      this.typingClient = this.typingClient.filter(
        (client) => !(client.name === name && client.chatId === chatId),
      );
      this.server.emit('typing', this.typingClient);
    }, 2000);
  }
}
