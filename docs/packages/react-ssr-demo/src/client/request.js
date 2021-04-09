import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mock.yonyoucloud.com/mock/13592',
});

export default instance;
