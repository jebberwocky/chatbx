import axios from 'axios';

const client = axios.create({
    baseURL:  process.env.REACT_APP_ANAYTICS_API_URL
  });

let actions = {
    log: (data,atag) => {
        client
        .post('/like', {
          data,
          atag
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error)=> {
            console.log(error)
        });
    }
};


export let AnalyticLogger = actions;