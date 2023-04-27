// 二次封装axios
import axios from "axios";
import { getConfig } from "../config/config";
const { apiOrigin, audience, scope } = getConfig();
//利用axios的create方法来创建axios实例
const request = axios.create({
  //基础路径也就是，相同的路径
  baseURL: '/api',
  //限定请求时间
  timeout: 400000,
});
//请求拦截器，在请求发出去之前可以拦截，在请求出去之前可以做一些事情
request.interceptors.request.use((config) => {
  //config,是一个配置对象，里面有个重要的属性，headers请求头
  //进度条开始
  let token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//响应拦截器，也就是请求回来之前可以拦截，在请求回来之前可以做一些事情
request.interceptors.response.use(
  (res) => {
    //成功的回调
    //进度条结束
    return res.data;
  },
  (err) => {
    //失败的回调
    return err.response.data;
  }
);

export default request;
