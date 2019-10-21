import axios from 'axios'
import { Modal } from 'antd'

export default class Axios {

    static ajax(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        // let baseApi = 'http://localhost:5050';
        let baseApi = 'https://alphaproject.applinzi.com';
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:options.method||'get',
                baseURL:baseApi,
                timeout:5000,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status === 200){
                    let res = response.data;
                    if (res.success){
                        resolve(res);
                        if (res.msg) {
                            Modal.success({
                                title:"提示",
                                content: res.msg
                            })
                        }
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}