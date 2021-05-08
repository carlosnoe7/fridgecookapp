import React, { createRef } from "react"
import lottie, { AnimationItem } from "lottie-web"
import LottieAnimation from "./no-desktop.json"
import { Box } from "grommet"

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = ({}) => {
  const animContainer: React.RefObject<HTMLDivElement> = createRef()
  React.useEffect(() => {
    let anim: AnimationItem
    if (animContainer.current) {
      anim = lottie.loadAnimation({
        container: animContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: LottieAnimation,
      })
    }
    return () => {
      anim.destroy()
    }
  })
  return (
    <Box margin={{ top: "large" }}>
      <div ref={animContainer} className="animation-container"></div>
    </Box>
  )
}

export default NotFound
