import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useState, useEffect } from 'react';
import Loading from '../Pages/Loading/Loading';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayOut = () => {

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);     
    setTimeout(() => { 
      setLoading(false);
    }, 2000) // Reduced loading for better UX
  }, []);
  
  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Navbar/>
      <main className="flex-grow pt-24">
        <Outlet/>
      </main>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MainLayOut;
