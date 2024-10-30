import { useState } from 'react';
import { formatTwitter } from '../helpers/formatTwitter';

export default function Message({ socket, id, editedAt, createdAt, content, author, me, isWaitingMessages }) {
  const meClass = me ? 'bg-gray-900' : 'bg-slate-800';
  const isWaitingMessagesClass = 'bg-slate-600';

  const [messageText, setMessageText] = useState(content);
  const [edit, setEdit] = useState(false);

  const setEditTrue = () => {
    setEdit(true);
    setMessageText(content);
  };
  const setEditFalse = () => setEdit(false);

  const onChange = (e) => {
    setMessageText(e.target.value);
  };

  const removeMessage = () => {
    socket.emit('removeMessage', { id }, () => {});
  };

  const sendMessage = (e) => {
    e.preventDefault();
    setEdit(false);
    if (content === messageText) return;
    socket.emit('updateMessage', { id, content: messageText }, () => {});
    setMessageText('');
  };

  const messageContent = () => {
    if (edit)
      return (
        <div className='grid grid-cols-1 min-w-20 max-w-xl gap-2'>
          <strong className='text-xs font-medium text-slate-400'>{author}</strong>
          <form className='flex gap-2 p-2 text-white' onSubmit={sendMessage}>
            <input
              value={messageText}
              onChange={onChange}
              className='text-sm p-2 w-full text-white ring-slate-900/10 shadow-sm rounded-lg focus:outline-none caret-pink-500 bg-slate-800 ring-0 focus:ring-2 focus:ring-pink-500 focus:bg-slate-900'
            />
            <button
              type='submit'
              className='px-4 py-2 font-semibold text-sm border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-2 outline-pink-800 active:bg-pink-800 bg-pink-700 text-slate-200 border-transparent'>
              Change
            </button>
          </form>
          <div className='text-xs font-medium text-slate-400 flex gap-2 justify-between'>
            <span onClick={setEditFalse} className='text-slate-400 cursor-pointer'>
              edit
            </span>
            <span className='text-slate-400'>{formatTwitter(editedAt)}</span>
          </div>
        </div>
      );

    return (
      <div className='grid grid-cols-1 min-w-20 max-w-xl gap-1 min-w-full'>
        <strong className='text-xs font-medium text-slate-400'>{author}</strong>
        <span className='text-sm font-medium text-slate-200'>
          {content} <span className='text-xs text-slate-400'>{editedAt > createdAt ? '(edited)' : ''}</span>
        </span>
        <div className='justify-self-end text-xs font-medium text-slate-400 flex gap-2'>
          {me && (
            <>
              <span onClick={setEditTrue} className='text-slate-400 cursor-pointer'>
                edit
              </span>
              <span onClick={removeMessage} className='text-red-400 cursor-pointer'>
                delete
              </span>
            </>
          )}
          <span className='text-slate-400'>{formatTwitter(editedAt)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`flex ${me ? 'justify-end' : ''} `}>
        <div className='flex'>
          <div
            className={`${
              isWaitingMessages ? isWaitingMessagesClass : meClass
            } min-w-36 shadow-lg rounded-2xl flex items-center gap-6`}>
            <div className='flex items-center gap-4 py-4 px-4 min-w-full'>{messageContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
