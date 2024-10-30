import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/user';

const CreateChat = ({ socket }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [name, setName] = useState('');
  const [emails, setEmails] = useState('');

  const sendForm = (e) => {
    e.preventDefault();

    socket.emit('createChat', { name, emails: [user.email, emails] }, () => {
      setName('');
      setEmails('');
      navigate.push('/');
    });
  };

  return (
    <div className='flex flex-auto justify-center items-center min-h-svh'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-white text-center'>4kChat</h1>
        <form className='flex flex-col gap-4 p-2 text-white' onSubmit={sendForm}>
          <div>
            <label>Name:</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='text-sm p-2 w-full ring-slate-900/10 shadow-sm rounded-lg focus:outline-none caret-pink-500 bg-slate-800 ring-0 highlight-white/5 focus:ring-2 focus:ring-pink-500 focus:bg-slate-900'
              spellCheck='true'
              placeholder='Me & Piper'
            />
          </div>
          <div>
            <label>Invite:</label>
            <input
              type='email'
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className='text-sm p-2 w-full ring-slate-900/10 shadow-sm rounded-lg focus:outline-none caret-pink-500 bg-slate-800 ring-0 highlight-white/5 focus:ring-2 focus:ring-pink-500 focus:bg-slate-900'
              spellCheck='true'
              placeholder='piper@example.com'
            />
          </div>
          <button
            type='submit'
            className='px-4 py-2 font-semibold text-sm border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-2 outline-pink-800 active:bg-pink-800 bg-pink-700 text-slate-200 border-transparent'>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChat;
