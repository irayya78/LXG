// src/api/axiosInstance.ts
import axios from 'axios';
import { apiHelper } from './apiHelper';

const { getServiceUrl } = apiHelper();

const axiosInstance = axios.create({
  baseURL: getServiceUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
