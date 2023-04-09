import axios from 'axios';
const AUTH_DATA_NAME = "callAuthData";

axios.interceptors.request.use(function(config) {
    const authToken = localStorage.getItem(AUTH_DATA_NAME);
    if(authToken) {
      config.headers.common = {
        "Authorization": `Basic ${authToken}`,
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      };
      console.log("HE INTERCEPTADO");
    }
    return config;
}, function(err) {
    return Promise.reject(err);
});