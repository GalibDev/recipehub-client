import React,{createContext,useContext,useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Toaster} from 'react-hot-toast';
import {api} from './api'; import App from './App'; import './styles.css';
const AuthContext=createContext(null); export const useAuth=()=>useContext(AuthContext);
function AuthProvider({children}){const[user,setUser]=useState(null),[loading,setLoading]=useState(true);const refresh=()=>api.get('/auth/session').then(r=>setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false));useEffect(()=>{refresh()},[]);return <AuthContext.Provider value={{user,setUser,loading,refresh}}>{children}</AuthContext.Provider>}
const queryClient=new QueryClient({defaultOptions:{queries:{staleTime:30000,retry:1}}});
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter><Toaster position="top-right" toastOptions={{duration:3500}}/></QueryClientProvider></React.StrictMode>);
