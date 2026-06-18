import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',withCredentials:true});
api.interceptors.response.use(r=>r,r=>{if(r.response?.status===401&&location.pathname.startsWith('/dashboard')){const next=encodeURIComponent(location.pathname+location.search);location.assign(`/login?next=${next}`)}return Promise.reject(r)});
export const messageOf=e=>e.response?.data?.message||e.message||'Something went wrong';
