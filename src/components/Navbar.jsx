import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';


import { signout } from '../api/axios';

const Navbar = () => {
  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint

    try {
      const data = await signout()
      localStorage.removeItem('email');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      const logOutMsg = data?.response.message;
      setAuth({logOutMsg});
      navigate('/');
    } catch (err) {
      console.log(err?.response);
    }
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex flex-shrink-0 items-center">
                  <img className="block h-8 w-auto lg:hidden" src="https://www.windcrane.com/application/files/3315/9059/4432/WINDCRANE_Logo_transparent.png" alt="Windcrane" />
                  <img className="hidden h-8 w-auto lg:block" src="https://www.windcrane.com/application/files/3315/9059/4432/WINDCRANE_Logo_transparent.png" alt="Windcrane" />
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                  <a href="#" className="inline-flex items-center border-b-2 border-yellow-500 px-1 pt-1 text-sm font-medium text-gray-900">
                    Dashboard
                  </a>
                </div>
              </div>

              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{localStorage.getItem('name')}</div>
                  <div className="text-sm font-medium text-gray-500">{localStorage.getItem('email')}</div>
                </div>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" />
                    </Menu.Button>
                  </div>
                  <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a href="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a onClick={logout} href="#" className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {/* Current: "bg-yellow-50 border-yellow-500 text-yellow-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              <Disclosure.Button as="a" href="#" className="block border-l-4 border-yellow-500 bg-yellow-50 py-2 pl-3 pr-4 text-base font-medium text-yellow-700">
                Dashboard
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{localStorage.getItem('email')}</div>
                  <div className="text-sm font-medium text-gray-500">{localStorage.getItem('email')}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button as="a" href="#" className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                  Your Profile
                </Disclosure.Button>

                <Disclosure.Button as="a" onClick={logout} className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
