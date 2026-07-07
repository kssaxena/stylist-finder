import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Button from "./components/Button";
import InputBox from "./components/Input";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home.jsx/Home"


function App() {
  return (
    <div className="p">
      <Header />
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
            
        </Routes>
      </div>
      <Footer />
    </div>
  );

 
}
export default App;
