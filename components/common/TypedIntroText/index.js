import React, { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import Fade from 'react-reveal/Fade'
import SocialLinkIcons from '../SocialLinkIcons'

const TypedIntroText = ({ }) => {
  const typedElementOne = useRef(null)
  const typedElementTwo = useRef(null)
  const typedElementThree = useRef(null)

  const STRINGS_ONE = ["Konstantinos Kyrtsonis."]
  const STRINGS_TWO = ["Data Scientist and Engineer. I am passionate about"]
  const STRINGS_THREE = ["understanding cause and effect.", "extracting decision making insight.", "helping machines learn.", "making the world a better place."]

  useEffect(() => {
    const typedOne = new Typed(typedElementOne.current, {
      strings: STRINGS_ONE,
      startDelay: 0,
      typeSpeed: 30,
      loop: false,
      showCursor: false
    });

    const typedTwo = new Typed(typedElementTwo.current, {
      strings: STRINGS_TWO,
      startDelay: 2000,
      typeSpeed: 30,
      loop: false,
      showCursor: false
    });

    const typedThree = new Typed(typedElementThree.current, {
      strings: STRINGS_THREE,
      startDelay: 5000,
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 200,
      loop: true,
      showCursor: false
    });

    return () => {
      typedOne.destroy()
      typedTwo.destroy()
      typedThree.destroy()
    }
  }, [])

  return (
    <Fade>
      <div className='typed-intro-text'>
        <h1 ref={typedElementOne}></h1>
        <p><span ref={typedElementTwo}></span> <b><span ref={typedElementThree}></span></b></p>
        <SocialLinkIcons isDarkIcons={true} />
      </div>
    </Fade>
  )
}



export default TypedIntroText
