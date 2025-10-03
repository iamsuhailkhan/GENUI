import React from 'react'
import { HiSun } from 'react-icons/hi2';
import { FaUser } from 'react-icons/fa';
import { RiSettings3Fill } from 'react-icons/ri';

const Navbar = () => {
  return (
    <>
      <div className='nav flex items-center px-5 md:px-20 justify-between gap-10 h-[70px] border-b-[1px] border-gray-800'>
        <div className='logo'>
            <h1 className='sp-text font-bold text-2xl'>GENUI</h1>
        </div>
        <div className='icons flex items-center gap-5'>
            <div className='icon'><HiSun/></div>
            <div className='icon'><FaUser/></div>
            <div className='icon'><RiSettings3Fill/></div>
        </div>

      </div>
    </>
  )
}

export default Navbar