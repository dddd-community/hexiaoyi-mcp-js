const axios = require('axios');

// 创建 axios 实例
const service = axios.create({
    baseURL: '', // 基础 URL = 基础 URL + 请求 URL
    timeout: 60000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求前处理
        return config;
    },
    error => {
        // 处理请求错误
        console.log(error); // 用于调试
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 获取响应数据
        const res = response.data;
        return res;
    },
    error => {
        console.log('错误：' + error); // 用于调试
        return Promise.reject(error);
    }
);


const apiSend = (api, method, data) => {
    const reqData = {};
    reqData.url = api;
    reqData.method = method;
    if(method === "GET") {
        reqData.params = data;
    } else if(method === "POST") {
        reqData.data = data;
    }
    return service(reqData);
}

const apiGet = async (api, data) => {
    return apiSend(api, "GET", data);
}

const apiPost = (api, data) => {
    return apiSend(api, "POST", data);
}


module.exports = {apiSend, apiGet, apiPost};