import axios from 'axios';
import getApiBaseUrl from '../apiHelper/apiHelper';

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  
});

export default axiosInstance;
