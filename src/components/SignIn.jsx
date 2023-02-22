import { useRef, useState, useEffect, useContext } from 'react';

import AuthContext from '../context/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { signin } from '../api/axios';

import useAuth from '../hooks/useAuth';

const SignIn = () => {
  const { setAuth } = useContext(AuthContext);
  const { auth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await signin({ email, password: pwd });
      // console.log(data);
      const accessToken = data?.access_token;
      const role = data?.profile.role;
      const userEmail = data?.profile.email;
      const name = data?.profile.full_name;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      setAuth({ email, pwd, role, accessToken });
      setEmail('');
      setPwd('');
      setSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err?.response);
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-12 w-auto" src="https://www.windcrane.com/application/files/3315/9059/4432/WINDCRANE_Logo_transparent.png" alt="Windcrane" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
          {errMsg}
        </p>
        {auth?.logOutMsg && <p className='text-center mt-5 text-green-500'>{auth?.logOutMsg}</p>}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input ref={userRef} autoComplete="off" onChange={e => setEmail(e.target.value)} value={email} id="email" name="email" type="text" required className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input type="password" id="password" onChange={e => setPwd(e.target.value)} value={pwd} name="password" autoComplete="current-password" required className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 sm:text-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-yellow-500 hover:text-yellow-600">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-yellow-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
