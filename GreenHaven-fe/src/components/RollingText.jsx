import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function RollingText({ text, isButton, forceHover }) {
  const [isHovered, setIsHovered] = useState(false);

  // Tambahkan useEffect untuk merespons forceHover
  useEffect(() => {
    if (forceHover) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [forceHover]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => !forceHover && setIsHovered(true)}
      onMouseLeave={() => !forceHover && setIsHovered(false)}
    >
      {/* Original text */}
      <span
        className={`inline-block transition-transform duration-300 ${
          isHovered ? '-translate-y-full' : 'translate-y-0'
        } ${isButton ? 'text-inherit' : 'text-gray-700 group-hover:text-emerald-800'}`}
      >
        {text}
      </span>

      {/* Duplicate text that slides up */}
      <span
        className={`absolute top-0 left-0 transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        } ${isButton ? 'text-inherit' : 'text-gray-700 group-hover:text-emerald-800'}`}
      >
        {text}
      </span>
    </div>
  );
}

RollingText.propTypes = {
  text: PropTypes.string.isRequired,
  isButton: PropTypes.bool,
  forceHover: PropTypes.bool,
};

RollingText.defaultProps = {
  isButton: false,
  forceHover: false,
};

export default RollingText;
