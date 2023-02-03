import React, { ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'

type Props = { children: ReactNode }

function Layout({ children }: Props) {
  return (
    <>
      <Navbar></Navbar>
      <main>{children}</main>
    </>
  )
}

export default Layout
