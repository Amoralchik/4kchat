import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Chats from '../components/ChatList';
import Chat from '../components/Chat';
import NewChatForm from '../components/NewChatForm';

import { sliceChats, setSelected, setChats } from '../store/chats';
import { selectUser } from '../store/user';

const App = ({ newChat }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const chats = useSelector(sliceChats);
  const user = useSelector(selectUser);

  const socket = io('http://localhost:3000');

  useEffect(() => {
    if (id) {
      dispatch(setSelected(parseInt(id)));
    }
  }, [id]);

  useEffect(() => {
    socket.emit('findAllChats', { email: user.email }, (res) => {
      dispatch(setChats(res));
    });
  }, [user.email]);

  return (
    <div className='font-mono bg-slate-900 min-h-screen'>
      <div className='container mx-auto'>
        <div className='flex'>
          {chats.length >= 1 && <Chats socket={socket} />}
          {chats.length >= 1 && newChat ? <NewChatForm socket={socket} /> : <Chat socket={socket} />}
        </div>
      </div>
    </div>
  );
};

export default App;
