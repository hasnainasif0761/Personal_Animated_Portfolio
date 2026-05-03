import React, { useRef, useState } from "react";
import { navLinks } from '../../constants/NabarConstants';
import './NavBar.scss'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

const NavBar = () => {
    const panelRef = useRef(null);
    const [open, setOpen] = useState(false);

    useGSAP(()=>{
        if(!panelRef.current) return ;
        gsap.set(panelRef.current,{
            height:0,
            opacity:0,
            y: -8,
            pointerEvents: "none"
        })
    },[])

    const animatePanel = (next) =>{
        const panel = panelRef.current;
        if(!panel) return;

        gsap.to(panel,{
            height: next ? "auto" : 0,
            opacity: next ? 1 : 0,
            y: next ? 1 : 0,
            duration: 0.25,
            ease: "power2.out",
            onStart: () => gsap.set(panel, {pointerEvents: "auto"}),
            onComplete: () =>{
                if(!next) gsap.set(panel, {pointerEvents: "none"})
            },
        });
    };

    const toggle = () =>{
        setOpen((prev)=>{
            const next = !prev;
            animatePanel(next);
            return next;
        })
    }

    const goto = (id) =>(e) =>{
        e.preventDefault();
        const el = document.getElementById(id)
        if(el) return
        if(open){
            setOpen(false)
            animatePanel(false)
        }
        ScrollTrigger.refresh();
        gsap.to(window,{
            duration:1,
            ease: "power3.out",
            scrollTo: {y:el,offsetY:80}
        })
    };
    return(
        <nav className="navbar">
            <div className="navbar-wrapper">
                <a className="nav-home" href="#home" onClick={()=>goto('home')} aria-label="Home">
                    <img src="" alt="" />
                </a>
            </div>
        </nav>
    )
}

export default NavBar