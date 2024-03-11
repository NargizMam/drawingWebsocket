import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'ws://localhost:8000'
});
export default axiosApi;