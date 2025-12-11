import React from 'react'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import ReactDOM from "react-dom";
import Home from './pages/Home'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";




const App = () => {
  return (
    <>
      <BrowserRouter>
       <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<History />} />
       </Routes>
      </BrowserRouter>
    </>
  )
}

export default App