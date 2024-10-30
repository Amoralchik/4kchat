import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      include: { author: true },
      data: {
        ...createMessageDto,
      },
    });
  }

  findAll(chatId: number) {
    if (!chatId) return [];
    if (chatId === 1) {
      return this.prisma.message.findMany({
        where: { chatId },
        take: -20,
        include: { author: true },
        orderBy: {
          id: 'asc',
        },
      });
    }
    return this.prisma.message.findMany({
      where: { chatId },
      include: { author: true },
      orderBy: {
        id: 'asc',
      },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.prisma.message.update({
      include: { author: true },
      data: {
        ...updateMessageDto,
        editedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  remove({ id }: { id: number }) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}
