/*
* 配置axios
* */

import axios from 'axios'

import vuex from '@/store/index'

// BaseUrl
let baseProxySuffix = localStorage.getItem('baseUrlProxy')
const baseUrl = baseProxySuffix || window.location.origin;

// 后缀
const suffix = '/jyorder'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? baseUrl + suffix : baseUrl + suffix;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'; /*application/x-www-form-urlencoded*/
axios.defaults.headers.token = localStorage.getItem('token')
// 超时时间
axios.defaults.timeout = 6000;
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;

// 请求时页面遮罩
function addSpin() {
    // 加蒙版
    vuex.commit('showLoading')
}

function removeSpin() {
    // 去蒙版
    vuex.commit('closeLoading')
}

//配置发送请求前的拦截器 可以设置token信息
axios.interceptors.request.use(
    config => {
        addSpin();
        return config
    }, error => {
        removeSpin();

        alert(error.message)
        return Promise.reject(error)
    }
);

// 配置响应拦截器
axios.interceptors.response.use(
    res => {
        removeSpin();

        // 判断请求是否成功
        if (res.data.code === -1) {
            return Promise.reject(res);
        } else if (res.data && res.data.code !== 0 ) {
            return Promise.reject(res);
        }

        // 成功
        return Promise.resolve(res.data) // 这里直接返回data, 即接口返回的所有数据
    }, error => {
        removeSpin();

        // 判断请求错误类型
        if (error && error.response) {

            switch (error.response.status) {

                case 400:
                    error.message = '接口请求错误'
                    break
                case 401:
                    error.message = '接口未授权'
                    break
                case 403:
                    error.message = '接口拒绝访问'
                    break
                case 404:
                    error.message = '接口找不到'
                    break
                case 408:
                    error.message = '接口请求超时'
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                case 501:
                    error.message = '接口服务未实现'
                    break
                case 502:
                    error.message = '网关错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网关超时'
                    break
                case 505:
                    error.message = 'HTTP版本不受支持'
                    break
            }
        }
        if (error.code === 'ECONNABORTED') {
            alert('接口访问超时')
        } else {
            alert(error.message);
        }

        // 判断是否登录失效，按照实际项目的接口返回状态来判断
        return Promise.reject(error);
    }
)

export {axios,baseUrl}