import React, { useEffect } from "react"
import gsap from 'gsap'
import {ScrollTrigger, SplitText, ScrollSmoother} from 'gsap/all'
import Wrap from './components/Wrap/Wrap'
import Cursor from "./ui/cursor/Cursor"
import NavBar from "./components/NavBar/NavBar"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

export const App = () => {
  useEffect(()=>{
     ScrollSmoother.create({
       smooth: 3,
       effects: true,
       normalizeScroll: true
     });

     ScrollTrigger.refresh();
  },[])
  return(
    <>
    <div id="smooth-wrapper">
    <div id="smooth-content">
      <Wrap />
      <Cursor />
      <NavBar/>
    </div>
    </div>
    </>
  )
}

export default App
