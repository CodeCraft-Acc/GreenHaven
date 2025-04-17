import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function TypewriterText({ text }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const resetStates = useCallback(() => {
    setDisplayText('');
    setIsDeleting(false);
    setIsWaiting(false);
    setCurrentIndex(0);
  }, []);

  // Reset states when text changes
  useEffect(() => {
    resetStates();
  }, [text, resetStates]);

  useEffect(() => {
    let timeoutId;

    const type = () => {
      // If waiting, pause before starting to delete
      if (isWaiting) {
        timeoutId = setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, 2000);
        return;
      }

      // Typing
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
          timeoutId = setTimeout(type, 100);
        } else {
          setIsWaiting(true);
        }
        return;
      }

      // Deleting
      if (displayText.length > 0) {
        setDisplayText((prev) => prev.slice(0, -1));
        timeoutId = setTimeout(type, 50);
      } else {
        setIsDeleting(false);
        setCurrentIndex(0);
        timeoutId = setTimeout(type, 100);
      }
    };

    timeoutId = setTimeout(type, 100);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, currentIndex, isDeleting, isWaiting, displayText.length]);

  return (
    <div className="inline-block text-[4rem] md:text-[6rem] font-bold">
      {displayText}
      <span className="animate-blink">|</span>
    </div>
  );
}

TypewriterText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TypewriterText;
