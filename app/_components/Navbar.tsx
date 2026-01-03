'use client'


import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Navbar() {

  const [toggle,setToggle]= useState(false)
  const {data:session,status} = useSession()

  function handleLogout(){
    signOut({callbackUrl:'/'})
  }

  function handleToggle()
  {
    setToggle(!toggle)
  }

  const links = [
   
    {path:'/brands' , content :'brands'},
    {path:'/categories' , content :'categories'},
    
  ]
   const auth = [
    {path:'/login' , content :'login'},
    {path:'/register' , content :'register'},
    
    
  ]
  
  return (
    
<nav className="bg-neutral-primary  w-full z-20 top-0 start-0 border-b border-default">
  <div className="max-w-screen-xl flex flex-col gap-10 md:flex-row md:flex-nowrap  items-center justify-between mx-auto p-4">
    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
 <Image width={100} height={100} src="/shopping logo.jpg" alt="logo"  />

    </Link>
    <button onClick={handleToggle} data-collapse-toggle="navbar-default" type="button" className="inline-flex cursor-pointer items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-default" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" /></svg>
    </button>
    <div className={`${toggle&&'hidden'} w-full md:flex  justify-between `} id='navbar-default'>
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
       
      {links.map(ele => {
  if (ele.path === '/products' && status !== 'authenticated') return null
  return (
    <li key={ele.content}>
      <Link href={ele.path} className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">
        {ele.content.toUpperCase()}
      </Link>
    </li>
  )
})}
      </ul>
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
       {
        status==='authenticated'?<>
         <li>Hi <span className='font-bold uppercase text-main'>{session?.user?.name}</span></li>
       <li><Link href='/wishlist'><i className='fa-solid fa-heart'></i></Link></li>
       <li><Link href='/cart'><i className='fa-solid fa-shopping-cart '></i></Link></li>
       <li className='cursor-pointer' onClick={handleLogout}>logout</li>
        </>:<>
         {auth.map(ele=> 
         <li key={ele.content}>
          <Link href={ele.path} className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">{ele.content.toUpperCase()}</Link>
        </li>
       )}</>
       }
        
      
      </ul>
    </div>
  </div>
</nav>


  )
}
