// import React from 'react'

// import Footer from "../shared/Footer"
// import Navbar from "../shared/Navbar"

type Props = {
    children: JSX.Element | JSX.Element[]
}

function AuthLayout({ children } : Props) {
  return (
   <>   
   
        <div>
            {children}

        </div>
    
 
   
   
   </>
  )
}

export default AuthLayout