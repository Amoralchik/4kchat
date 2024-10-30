import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWaitingMessages } from '../store/chats';
import { selectUser } from '../store/user';
import { DateTime } from 'luxon';

const ChatInput = ({ socket, chatId }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userStatus = useSelector((state) => state.user.status);
  const waitingMessages = useSelector((state) => state.chats.waitingMessages);
  const [messageText, setMessageText] = useState('');
  const [typing, setTyping] = useState('');
  const [typingCounter, setTypingCounter] = useState(0);

  const emitTyping = () => {
    socket.emit('typing', { name: user.name, chatId, isTyping: true, typingCounter });
    setTypingCounter((prev) => prev + 1);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    dispatch(
      addWaitingMessages({
        author: user,
        editedAt: DateTime.now(),
        isWaitingMessages: true,
        content: messageText,
        authorId: user.id,
        type: 'TEXT',
        chatId,
        id: `wm-${waitingMessages.length}`,
      })
    );
    setMessageText('');
  };

  useEffect(() => {
    const handleTyping = (clients) => {
      const clientsTyping = clients
        .filter((client) => client.name !== user.name && client.isTyping && client.chatId === chatId)
        .map((client) => client.name);

      if (clientsTyping.length >= 1) {
        setTyping(`${clientsTyping.join(', ')} is typing...`);
      }
      if (clientsTyping.length >= 4) {
        setTyping('Several people are typing...');
      }
      if (clientsTyping.length === 0) {
        setTyping('');
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [user.name, chatId]);

  return (
    <div>
      {typing && <div className='px-2 font-bold text-slate-300'>{typing}</div>}
      <form className='flex gap-2 p-2 text-white' onSubmit={sendMessage}>
        <input
          className='text-sm p-2 w-full ring-slate-900/10 shadow-sm rounded-lg focus:outline-none caret-pink-500 bg-slate-800 ring-0 focus:ring-2 focus:ring-pink-500 focus:bg-slate-900'
          spellCheck='true'
          placeholder='Enter message here'
          value={messageText}
          minLength={1}
          onChange={(e) => {
            setMessageText(e.target.value);
            emitTyping();
          }}
        />
        <button
          type='submit'
          className='px-4 py-2 font-semibold text-sm border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-2 outline-pink-800 active:bg-pink-800 bg-pink-700 text-slate-200 border-transparent'>
          Send
        </button>
      </form>
      {userStatus === 'offline' && (
        <div className='bg-slate-800 text-slate-400'>
          <p>offline</p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
