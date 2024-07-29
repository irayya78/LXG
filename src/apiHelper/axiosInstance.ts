import axios from 'axios';
import getApiBaseUrl from '../apiHelper/apiHelper';
const API_KEY = "j4bEr%2fevukm%2bLQRfzAmAsg%3d%3d";
const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'lxValKey': API_KEY
}
  
});

export default axiosInstance;
