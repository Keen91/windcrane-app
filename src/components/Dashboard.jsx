import { getDeviceLists } from '../api/axios';
import { useState, useEffect } from 'react';
import DeviceList from './DeviceList';
import Navbar from './Navbar';
import Pagination from './Pagination';
import ChartPage from './ChartPage';
import SearchBar from './SearchBar';

const Dashboard = () => {
  // States for fetching and filtering the devices
  const [deviceList, setDeviceList] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState(deviceList);

  // States for getting charts page.
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [view, setView] = useState('dashboard');

  // State for search and search category.
  const [selectedCategory, setSelectedCategory] = useState('Device IMEI');

  // States for pagination.
  const [page, setPage] = useState(1);
  const [totalDevices, setTotalDevices] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [editDeviceCount, setEditDeviceCount] = useState(null);

  // Function for selecting devices for the chart page. The selection is according to the imei.
  // This function is passed to DeviceList component to be able to select items.
  const selectDevice = imei => {
    const device = deviceList.find(device => device?.imei === imei);
    if (selectedDevices.length === 0) {
      setSelectedDevices([...selectedDevices, device]);
    } else if (selectedDevices.length > 0) {
      const deviceSelected = selectedDevices.find(device => device?.imei === imei);
      if (deviceSelected) {
        const devices = selectedDevices.filter(device => {
          return device.imei !== imei;
        });
        setSelectedDevices(devices);
      } else {
        setSelectedDevices([...selectedDevices, device]);
      }
    }
  };

  // Use effect to update the list when the selectedCategory is updated.
  useEffect(() => {
    setFilteredDevices(deviceList);
  }, [selectedCategory]);

  // handleSearch to live update the data whenever the search bar is changed.
  const handleSearch = keyword => {
    setFilteredDevices(deviceList);

    if (selectedCategory === 'Device IMEI') {
      setFilteredDevices(previousDevices => {
        return previousDevices.filter(device => device.imei.toLowerCase().includes(keyword.toLowerCase()));
      });
    } else if (selectedCategory === 'Device name') {
      setFilteredDevices(previousDevices => {
        return previousDevices.filter(device => device.name.toLowerCase().includes(keyword.toLowerCase()));
      });
    } else if (selectedCategory === 'Project Site name') {
      setFilteredDevices(previousDevices => {
        return previousDevices.filter(device => device.project_site.name.toLowerCase().includes(keyword.toLowerCase()));
      });
    }
  };

  // The following function and state are for sorting purposes, it is passed to the DeviceList component.
  const [toggle, setToggle] = useState(false);

  const handleSort = sortCategory => {
    const newToggle = !toggle;
    setToggle(newToggle);
    if (sortCategory === 'Name') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? (a.name > b.name ? -1 : 1) : b.name > a.name ? -1 : 1;
        })
      );
    } else if (sortCategory === 'Model') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? (a.model > b.model ? -1 : 1) : b.model > a.model ? -1 : 1;
        })
      );
    } else if (sortCategory === 'Status') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? (a.status > b.status ? -1 : 1) : b.status > a.status ? -1 : 1;
        })
      );
    } else if (sortCategory === 'Project Site') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? (a.project_site.name > b.project_site.name ? -1 : 1) : b.project_site.name > a.project_site.name ? -1 : 1;
        })
      );
    } else if (sortCategory === 'Customer') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? (a.project_site.customer > b.project_site.customer ? -1 : 1) : b.project_site.customer > a.project_site.customer ? -1 : 1;
        })
      );
    } else if (sortCategory === 'Updated') {
      setFilteredDevices(preData =>
        preData.sort((a, b) => {
          return newToggle ? new Date(a.updated) - new Date(b.updated) : new Date(b.updated) - new Date(a.updated);
        })
      );
    }
  };

  // The main function to fetch the devices according to the page number.
  const getDevices = async ({ page }) => {
    try {
      const data = await getDeviceLists({ page });
      setDeviceList(data.response.response_body.devices);
      setFilteredDevices(data.response.response_body.devices);
      // The following are for pagination system.
      setTotalDevices(data.response.response_body.device_count);
      setDeviceCount(data.response.response_body.device_count);
      setNumberOfPages(Math.ceil(data.response.response_body.device_count / data.response.response_body.devices_per_page));
      setPage(data.response.response_body.page);
      // setSuccess(true);
    } catch (err) {
      console.log(err?.response);
    }
  };

  // The fetch function runs everytime the page number changes.
  useEffect(() => {
    getDevices(page);
  }, [page]);

  // Helper functions to show specific number of items on the screen.
  const paginate = (array, page_size, page_number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  };

  useEffect(() => {
    if (editDeviceCount === false) {
      setFilteredDevices(paginate(deviceList, deviceCount, 1));
    }
  }, [editDeviceCount]);

  function changeNumberOfDevices(e) {
    setDeviceCount(e.target.value);
  }

  return (
    <>
      <Navbar />
      {view === 'dashboard' ? (
        <>
          <div className=" mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 mt-10">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Devices</h1>
                <p className="mt-2 text-sm text-gray-700">A list of all the cranes in your account</p>
              </div>
            </div>
            <SearchBar selected={selectedCategory} setSelected={setSelectedCategory} handleSearch={handleSearch} />
          </div>

          <DeviceList deviceList={filteredDevices} selectDevice={selectDevice} handleSort={handleSort} />
          <Pagination deviceCount={deviceCount} numberOfPages={numberOfPages} page={page} totalDevices={totalDevices} editDeviceCount={editDeviceCount} setEditDeviceCount={setEditDeviceCount} changeNumberOfDevices={changeNumberOfDevices} />
        </>
      ) : (
        <ChartPage view={view} setView={setView} selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} />
      )}

      {selectedDevices.length > 0 && (
        <button
          className="fixed bottom-3 right-14 w-72 p-5 border rounded-lg bg-yellow-500 text-black"
          onClick={() => {
            setView('charts');
          }}
        >
          Generate Chart
        </button>
      )}
    </>
  );
};

export default Dashboard;
