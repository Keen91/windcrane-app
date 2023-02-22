import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';

const SearchBar = ({ selected, setSelected, handleSearch }) => {
  const category = ['Device IMEI', 'Device name', 'Project Site name'];
  const [keyword, setKeyword] = useState('');

  const handleInputChange = e => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    handleSearch(keyword);
  }, [keyword]);

  return (
    <div className="flex justify-end">
      {/* className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end ' */}

      <div className="lg:w-1/2 w-full">
        <div className="flex ">
          <Listbox value={selected} onChange={setSelected}>
            <div>
              <Listbox.Button className="relative w-full cursor-default bg-white py-2 pl-3 pr-10 text-lef focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600">
                <span className="block truncate">{selected}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {category.map((person, personIdx) => (
                    <Listbox.Option key={personIdx} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-600' : 'text-gray-900'}`} value={person}>
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{person}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          <div className="relative w-full">
            <input
              // type="search"
              onChange={e => handleInputChange(e)}
              id="search-dropdown"
              className="block py-1.5 w-full z-20  text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:outline-0 focus:border-yellow-500"
              required
            />
            <div className="absolute top-0 right-0 p-2  font-medium text-yellow-500">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span className="sr-only">Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
