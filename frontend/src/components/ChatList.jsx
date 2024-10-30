import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addChat, selectAllChats } from '../store/chats';
import { formatTwitter } from '../helpers/formatTwitter';

const ChatList = ({ socket }) => {
  const dispatch = useDispatch();
  const chats = useSelector(selectAllChats);
  const selectedChatIndex = useSelector((state) => state.chats.selected);

  useEffect(() => {
    const handleNewChat = (newChat) => {
      dispatch(addChat(newChat));
    };

    socket.on('newChat', handleNewChat);

    return () => {
      socket.off('newChat', handleNewChat);
    };
  }, [dispatch, socket]);

  const ogClass = 'p-2 hover:bg-pink-700 hover:text-slate-100 active:bg-pink-800';
  const selectedClass = (index) =>
    selectedChatIndex === index ? `${ogClass} text-slate-100 bg-pink-600` : `${ogClass} bg-slate-800`;

  return (
    <div className='bg-slate-800 min-h-svh max-h-svh overflow-y-auto'>
      <div className='flex-1'>
        <div className='leading-6 w-72 mx-auto cursor-pointer overflow-hidden divide-y-2 divide-slate-500 grid grid-cols-1 font-mono font-bold'>
          <Link to='/chat/new'>
            <div className={selectedClass('new')}>
              <div className='flex items-center gap-2 px-2'>
                <div className='flex flex-col w-64 truncate'>
                  <div className='flex justify-between'>
                    <h1 className='text-slate-200'>Create New Chat</h1>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          {chats.map((chat, index) => (
            <Link to={`/chat/${index}`} key={index}>
              <div className={selectedClass(index)}>
                <div className='flex items-center gap-2 px-2'>
                  <div className='flex flex-col w-64 truncate'>
                    <div className='flex justify-between'>
                      <h1 className='text-slate-200'>{chat.name}</h1>
                      <span className='text-slate-400'>{formatTwitter(chat.messages[0].editedAt)}</span>
                    </div>
                    <h2 className='text-slate-300 truncate'>
                      {chat.messages[0].author?.name ? `${chat.messages[0].author.name}: ` : ''}
                      {chat.messages[0].content}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
