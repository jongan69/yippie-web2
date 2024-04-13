import React, { useState } from 'react';

const Switch = ({ onChange }: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <label className="switch">
        POST: 
      <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;