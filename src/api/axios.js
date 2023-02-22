import axios from 'axios';

export const signin = async ({ email, password }) => {
  const response = await axios.post('https://user.windcrane.com/manager/api/v1/login?email=windcrane.test', JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
  // console.log(response.data.response.response_body.user);
  return response.data.response.response_body.user;
};

export const signout = async () => {
  const response = await axios.get(`https://user.windcrane.com/manager/api/v1/logout`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    withCredentials: true
  });
  // console.log(response.data);
  return response.data;
};

export const getDeviceLists = async (pageParam = 1) => {
  // const response = await axios.get(`/device/list?page=${pageParam}`)
  const response = await axios.get(`https://user.windcrane.com/manager/api/v1/device/list?page=${pageParam}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    withCredentials: true
  });
  // console.log(response.data);
  return response.data;
};

export const getHistoricChartData = async (device1, ...others) => {
  let link;
  // One device selected
  if (others.length === 0) {
    link = `https://user.windcrane.com/manager/api/v1/historic?s=${device1},A1,lastmax&r=week&i=minute&n=1`;
  }
  // Multiple devices selected
  else if (others.length > 0) {
    const multipleDevices = others.map(device => `;${device},A1,generated`);
    link = `https://user.windcrane.com/manager/api/v1/historic?s=${device1},A1,lastmax${multipleDevices.map(d => d)}&r=week&i=minute&n=1`;
    // user.windcrane.com/manager/api/v1/historic?s=580055403725,A1,lastmax;580055402602,A1,generated&r=week&i=minute&n=1/
    // user.windcrane.com/manager/api/v1/historic?s=580055403725,A1,lastmax;580055402602,A1,generated,;580053212383,A1,generated&r=week&i=minute&n=1
  }
  const response = await axios.get(link, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    withCredentials: true
  });
  return response.data;
};
