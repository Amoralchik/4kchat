/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeWaitingMessages,
  selectedChats,
  selectChatMessages,
  setChatMessage,
  addChatMessage,
  removeChatMessage,
  updateChatMessage,
} from '../store/chats';
import { setStatus, selectUser } from '../store/user';
import InputField from './Input';
import Message from './Message';

export default function Chat({ socket }) {
  const dispatch = useDispatch();
  const selectedChat = useSelector(selectedChats);
  const messages = useSelector((state) => selectChatMessages(state, selectedChat.id));
  const waitingMessages = useSelector((state) => state.chats.waitingMessages);
  const userStatus = useSelector((state) => state.user.status);
  const user = useSelector(selectUser);

  const messagesContainer = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  };

  const handleFetchMessages = () => {
    if (userStatus === 'offline') return;
    socket.emit('findAllMessages', { chatId: selectedChat.id }, (res) => {
      dispatch(setChatMessage({ chatId: selectedChat.id, messages: res }));
      scrollToBottom();
    });
  };

  useEffect(() => {
    handleFetchMessages();

    const handleNewMessage = (message) => {
      dispatch(addChatMessage({ chatId: message.chatId, message }));
      scrollToBottom();
    };

    const handleRemovedMessage = (message) => {
      dispatch(removeChatMessage({ chatId: message.chatId, message }));
    };

    const handleUpdatedMessage = (message) => {
      dispatch(updateChatMessage({ chatId: message.chatId, message }));
    };

    socket.on('message', handleNewMessage);
    socket.on('removedMessage', handleRemovedMessage);
    socket.on('updatedMessage', handleUpdatedMessage);

    const handleOnlineStatus = () => {
      dispatch(setStatus('online'));
    };

    const handleOfflineStatus = () => {
      dispatch(setStatus('offline'));
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('removedMessage', handleRemovedMessage);
      socket.off('updatedMessage', handleUpdatedMessage);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, [selectedChat.id]);

  useEffect(() => {
    if (userStatus === 'online') {
      handleFetchMessages();
    }
  }, [userStatus]);

  useEffect(() => {
    if (waitingMessages.length > 0 && userStatus === 'online') {
      waitingMessages.forEach(({ content, authorId, type, chatId, id }) => {
        socket.emit('createMessage', { content, authorId, type, chatId }, () => {
          dispatch(removeWaitingMessages(id));
        });
      });
    }
  }, [waitingMessages, userStatus]);

  return (
    <>
      <div className='flex-auto flex-col flex max-h-screen'>
        <div className='bg-slate-800 text-slate-200 py-4 px-4 flex justify-between items-center'>
          <span>{selectedChat.name}</span>
        </div>
        <div className='bg-gradient-to-r from-purple-900 to-pink-900 flex-grow overflow-y-auto px-4 py-2 content-end'>
          <div ref={messagesContainer} className='grid grid-cols-1 gap-2'>
            {messages.map((message) => (
              <Message
                key={message.id}
                editedAt={message.editedAt}
                createdAt={message.createdAt || message.editedAt}
                content={message.content}
                author={message.author.name}
                me={message.author.email === user.email}
                isWaitingMessages={message.isWaitingMessages}
                id={message.id}
                socket={socket}
              />
            ))}
          </div>
        </div>
        <div className='bg-slate-700'>
          <InputField socket={socket} chatId={selectedChat.id} />
        </div>
      </div>
    </>
  );
}
