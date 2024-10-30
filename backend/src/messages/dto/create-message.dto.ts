export class CreateMessageDto {
  authorId: number;
  type: 'FILE' | 'AUDIO' | 'TEXT';
  chatId: number;
  content: string;
}
