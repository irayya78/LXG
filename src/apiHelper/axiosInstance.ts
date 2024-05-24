import axios from 'axios';
import getApiBaseUrl from '../apiHelper/apiHelper';

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
