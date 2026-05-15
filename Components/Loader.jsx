import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Loader = () => {
  const [visible, setVisible] = useState(true); // Loader opacity
  const [display, setDisplay] = useState(true); // Remove from DOM
  const [bgColor, setBgColor] = useState('white'); // Background color

  useEffect(() => {
    const loaderDuration = 2500;     // Loader visible
    const fadeDuration = 500;        // Fade duration
    const blackDuration = 1500;      // Time background stays black before reverting

    // 1️⃣ Fade out loader
    const fadeTimer = setTimeout(() => setVisible(false), loaderDuration);

    // 2️⃣ Change background to black
    const blackTimer = setTimeout(() => setBgColor('#f0f0f0'), loaderDuration);

    // 3️⃣ Revert background to white smoothly
    const whiteTimer = setTimeout(() => setBgColor('white'), loaderDuration + fadeDuration);

    // 4️⃣ Remove from DOM after all transitions
    const removeTimer = setTimeout(() => setDisplay(false), loaderDuration + blackDuration );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(blackTimer);
      clearTimeout(whiteTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!display) return null;

  return (
    <StyledWrapper bgColor={bgColor}>
      <div className={`loader ${visible ? 'visible' : 'hidden'}`} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.bgColor};
  transition: background-color 1s ease, opacity 0.5s ease;
  z-index: 9999;

  .loader {
    width: 2.5em;
    height: 2.5em;
    transform: rotate(165deg);
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  .loader.hidden {
    opacity: 0;
  }

  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  }

  .loader:before {
    animation: before8 2s infinite;
  }

  .loader:after {
    animation: after6 2s infinite;
  }

  @keyframes before8 {
    0% { width: 0.5em; box-shadow: 1em -0.5em rgba(225,20,98,0.75), -1em 0.5em rgba(111,202,220,0.75); }
    35% { width: 2.5em; box-shadow: 0 -0.5em rgba(225,20,98,0.75), 0 0.5em rgba(111,202,220,0.75); }
    70% { width: 0.5em; box-shadow: -1em -0.5em rgba(225,20,98,0.75), 1em 0.5em rgba(111,202,220,0.75); }
    100% { width: 0.5em; box-shadow: 1em -0.5em rgba(225,20,98,0.75), -1em 0.5em rgba(111,202,220,0.75); }
  }

  @keyframes after6 {
    0% { height: 0.5em; box-shadow: 0.5em 1em rgba(61,184,143,0.75), -0.5em -1em rgba(233,169,32,0.75); }
    35% { height: 2.5em; box-shadow: 0.5em 0 rgba(61,184,143,0.75), -0.5em 0 rgba(233,169,32,0.75); }
    70% { height: 0.5em; box-shadow: 0.5em -1em rgba(61,184,143,0.75), -0.5em 1em rgba(233,169,32,0.75); }
    100% { height: 0.5em; box-shadow: 0.5em 1em rgba(61,184,143,0.75), -0.5em -1em rgba(233,169,32,0.75); }
  }
`;

export default Loader;
