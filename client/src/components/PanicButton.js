import React from 'react';

const PanicButton = ({ onPanic }) => {
  return (
    <button className="panic-button" onClick={onPanic}>
      🚨 PANIC ALERT
    </button>
  );
};

export default PanicButton;
