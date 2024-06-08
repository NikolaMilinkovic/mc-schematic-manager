import React, { useState } from 'react';
import './checkbox.scss';

function Checkbox({
  label, checked, customId, name,
}) {
  const defaultChecked = checked || false;
  const [isChecked, setIsChecked] = useState(defaultChecked);
  function toggleCheck() {
    isChecked === true ? setIsChecked(false) : setIsChecked(true);
  }
  function placeholder() {

  }
  return (
    <div className="checkbox-container" onClick={toggleCheck}>
      <label htmlFor="checkbox" className={isChecked ? 'label-checked' : 'label-unchecked'}>{label}</label>
      <input type="checkbox" className="checkbox" data-custom-id={customId} checked={isChecked} name={name} onChange={placeholder} />
    </div>
  );
}

export default Checkbox;
