
import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useState, useEffect } from 'react';
import Loading from '../Pages/Loading/Loading';


const MainLayOut = () => {

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);     
    setTimeout(() => { 
      setLoading(false);
    }, 3000)
  }, []);
  if (loading) return <Loading />;


  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  );
};

export default MainLayOut;
