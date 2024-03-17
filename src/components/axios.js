import axios from "axios";

const instance = axios.create({

    baseURL: 'http://127.0.0.1:5001/urbancartel-2024/us-central1/api' //api url(cloudfunction url)

});

export default instance;
