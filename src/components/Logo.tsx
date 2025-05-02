import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-voicify-orange flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M19 11.5C19 11.5 19 11.5 19 11.5C19 15.64 15.64 19 11.5 19H11V22H13V19.01C16.38 18.93 19 15.62 19 11.5Z"
            fill="#FFFFFF"
          />
          <path
            d="M5 11.5C5 15.17 7.8 18.2 11.5 18.94V22H8.5V21H6C5.45 21 5 20.55 5 20V11.5Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
      <span className="text-xl font-montserrat font-bold">
        <span className="text-voicify-orange">Vocal</span>
        <span className="text-voicify-blue dark:text-white">Express</span>
      </span>
    </div>
  );
};

export default Logo;
