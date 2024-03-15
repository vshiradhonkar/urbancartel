import axios from "axios";

const instance = axios.create({

    baseURL: '...' //api url(cloudfunction url)

});

export default instance;
