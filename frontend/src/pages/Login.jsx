import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../store/user';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: '1' }),
      });

      if (!response.ok) {
        throw new Error('Invalid email');
      }

      const data = await response.json();
      dispatch(setUser(data));
      navigate('/chat/0');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='font-mono bg-slate-900'>
      <div className='container mx-auto'>
        <div className='flex justify-center items-center min-h-screen'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold text-white text-center'>4kChat</h1>
            <form className='flex flex-col gap-4 p-2 text-white' onSubmit={handleSubmit}>
              <div>
                <label> Login: </label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id='email'
                  required
                  className='text-sm p-2 w-full ring-slate-900/10 shadow-sm rounded-lg focus:outline-none caret-pink-500 bg-slate-800 ring-0 highlight-white/5 focus:ring-2 focus:ring-pink-500 focus:bg-slate-900'
                  spellCheck='true'
                />
              </div>
              <button
                type='submit'
                className='px-4 py-2 font-semibold text-sm border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-2 outline-pink-800 active:bg-pink-800 bg-pink-700 text-slate-200 border-transparent'>
                Submit
              </button>
              {error && <p className='text-red-500'>{error}</p>}
            </form>
            <Link to='/registration'>
              <div className='p-2'>
                <button className='min-w-full px-4 py-2 font-semibold text-sm rounded-md shadow-sm active:bg-pink-800 bg-pink-600 text-slate-200 border-transparent'>
                  Registration
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
