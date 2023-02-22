const DeviceList = ({ deviceList, selectDevice, handleSort }) => {

  const tableHeader = ['Name', 'Model', 'Status', 'Project Site', 'Customer', 'Updated'];

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeader.map((header, index) => (
                      <th scope="col" key={index}>
                        <div className="flex items-center py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">
                          {header}
                          <svg
                            onClick={() => {
                              handleSort(header);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 ml-1"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 320 512"
                          >
                            <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                          </svg>{' '}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deviceList.map(device => (
                    <tr
                      key={device.imei}
                      onClick={e => {
                        selectDevice(device.imei);
                        e.currentTarget.classList.toggle('bg-yellow-50');
                      }}
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-xs font-medium text-gray-900">{device.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{device.model}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
                        <span className={`  inline-flex rounded-full px-2 text-xs font-semibold leading-5   ${device.status === 'online' ? 'text-green-800 bg-green-100' : device.status === 'waiting' ? 'text-yellow-800 bg-yellow-100' : 'text-red-800 bg-red-100'}`}>{device.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{device.project_site.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{device.project_site.customer}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{device.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceList;
