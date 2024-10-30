import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma.service';
import {} from '@prisma/client';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  create(createChatDto: CreateChatDto) {
    return this.prisma.chat.create({
      data: {
        name: createChatDto.name,
        User: {
          connect: createChatDto.emails
            .filter((email) => email)
            .map((email) => ({ email })),
        },
      },
      select: {
        messages: true,
        name: true,
        id: true,
        User: true,
      },
    });
  }

  findAll(email: string) {
    return this.prisma.chat.findMany({
      where: {
        User: {
          some: {
            email: {
              equals: email,
            },
          },
        },
      },
      include: {
        messages: {
          include: {
            author: true,
          },
          take: 1,
          orderBy: { id: 'desc' },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return this.prisma.chat.update({
      where: {
        id,
      },
      data: updateChatDto,
    });
  }

  remove(id: number) {
    return this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }
}
