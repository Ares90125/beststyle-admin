import axios from 'axios'
import {useAuthStore} from '@/pinia/modules/useAuthStore';
import router from '@/router'
// Request interceptor
axios.interceptors.request.use(request => {
  const auth = useAuthStore();
  const token = auth.token;
  if (token) {
    try{
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    catch(e){
      console.log(e);
    }
  }
  return request
})
axios.interceptors.response.use(response =>{
  const data = response.data;
  if(data.status&&data.status==0){
    router.push('/404');
  }
  return response
}, error=>{
  const { status, data } = error.response;
  if(status==404&&data.error=='unauthenticated.'){
    const auth = useAuthStore();
    auth.logout();
    router.push({ name: 'login' })
  }
  if(status==400){
    const auth = useAuthStore();
    auth.setIp(data.error);
    router.push({ name: 'blocked' })
  }
  return error.response;
})