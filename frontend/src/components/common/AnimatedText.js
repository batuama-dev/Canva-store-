import React, { useState, useEffect } from 'react';

const AnimatedText = ({ texts, loopDelay = 30000, sentenceDelay = 2500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(true);

  useEffect(() => {
    // Timer for cycling through sentences
    const sentenceTimer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % texts.length);
        setIsFading(false);
      }, 500); // Fade-out duration
    }, sentenceDelay);

    // Timer for restarting the whole loop
    const loopTimer = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(0);
            setIsFading(false);
        }, 500);
    }, loopDelay);


    // Initial fade-in
    setTimeout(() => setIsFading(false), 100);

    return () => {
      clearInterval(sentenceTimer);
      clearInterval(loopTimer);
    };
  }, [texts.length, loopDelay, sentenceDelay]);

  return (
    <div className="relative h-56 sm:h-48"> {/* Container to hold text and prevent layout shifts */}
      {texts.map((text, index) => (
        <div
          key={index}
          className={`absolute w-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex && !isFading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {text}
        </div>
      ))}
    </div>
  );
};

export default AnimatedText;
