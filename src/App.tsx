import * as React from "react";
import "./styles.css";
import lottie from "lottie-web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LottieScrollTrigger = (vars) => {
  let playhead = { frame: 0 },
    target = gsap.utils.toArray(vars.target)[0],
    speeds = { slow: "+=2000", medium: "+=1000", fast: "+=500" },
    st = {
      trigger: target,
      pin: true,
      start: "top top",
      end: speeds[vars.speed] || "+=1000",
      scrub: 1
    },
    ctx = gsap.context && gsap.context(),
    animation = lottie.loadAnimation({
      container: target,
      renderer: vars.renderer || "svg",
      loop: false,
      autoplay: false,
      path: vars.path,
      rendererSettings: vars.rendererSettings || {
        preserveAspectRatio: "xMidYMid slice"
      }
    });
  for (let p in vars) {
    // let users override the ScrollTrigger defaults
    st[p] = vars[p];
  }
  animation.addEventListener("DOMLoaded", function () {
    let createTween = function () {
      animation.frameTween = gsap.to(playhead, {
        frame: animation.totalFrames - 1,
        ease: "none",
        onUpdate: () => animation.goToAndStop(playhead.frame, true),
        scrollTrigger: st
      });
      return () => animation.destroy && animation.destroy();
    };
    ctx && ctx.add ? ctx.add(createTween) : createTween();
    // in case there are any other ScrollTriggers on the page and the loading of this Lottie asset caused layout changes
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
  return animation;
};

const LottieControl = () => {
  gsap.registerPlugin(ScrollTrigger);
  const lottieRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    LottieScrollTrigger({
      target: "#lottie-scroll",
      path: "https://assets.codepen.io/35984/tapered_hello.json",
      speed: "medium",
      scrub: true
    });
    let ctx = gsap.context(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-trigger",
          start: "top top",
          end: () => "+=" + 650,
          scrub: true,
          pin: true,
          pinSpacing: true
        }
      });
      tl.to(".before", {
        display: "none",
        opacity: 0,
        y: -20,
        duration: 1
      });
    }, scrollRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scrollRef} style={{ display: "flex" }}>
      <div
        id="lottie-scroll"
        style={{ backgroundColor: "yellow", width: "50%", height: "300px" }}
        ref={lottieRef}
      ></div>
      <div
        id="scroll-trigger"
        style={{ width: "50%", backgroundColor: "green" }}
      >
        <div className="before">hey, guys</div>
      </div>
    </div>
  );
};

export default LottieControl;
