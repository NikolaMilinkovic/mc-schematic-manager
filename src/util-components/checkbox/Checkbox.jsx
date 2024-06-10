/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './checkbox.scss';

function Checkbox({
  label, checked, customId, permission, category, handleCheckboxChange,
}) {
  const defaultChecked = checked || false;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const toggleCheckbox = (event) => {
    setIsChecked((prevChecked) => {
      const updatedChecked = !prevChecked;
      handleCheckboxChange(event, updatedChecked);
      return updatedChecked;
    });
  };
  function placeholder() {

  }

  return (
    <div
      className="checkbox-container"
      onClick={(event) => toggleCheckbox(event)}
      data-custom-id={customId}
      data-permission={permission}
      data-category={category}
    >
      <label
        htmlFor="checkbox"
        className={isChecked ? 'label-checked' : 'label-unchecked'}
        data-custom-id={customId}
        data-permission={permission}
        data-category={category}
      >
        {label}
      </label>
      <input
        type="checkbox"
        className="checkbox"
        checked={isChecked}
        data-custom-id={customId}
        data-permission={permission}
        data-category={category}
        onChange={placeholder}
      />
    </div>
  );
}

export default Checkbox;
