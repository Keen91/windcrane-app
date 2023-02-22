const Pagination = ({ deviceCount, totalDevices, changeNumberOfDevices, setEditDeviceCount, editDeviceCount }) => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <nav className="flex items-center justify-between bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to {''}
            {!editDeviceCount ? (
              <span className="font-medium" onDoubleClick={() => setEditDeviceCount(true)}>
                {deviceCount}
              </span>
            ) : (
              <input
                autoFocus
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === 'Escape') {
                    setEditDeviceCount(false);
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
                type="text"
                className="w-10 rounded-md focus:border focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                value={deviceCount}
                onChange={changeNumberOfDevices}
              />
            )}
            {''} of <span className="font-medium">{totalDevices}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <button  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
