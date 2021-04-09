import axios from 'axios';

const createInstance = (req) =>
  axios.create({
    baseURL: 'https://mock.yonyoucloud.com/mock/13592',
    headers: {
      cookie: req.get('cookie') || '',
    },
  });

export default createInstance;
