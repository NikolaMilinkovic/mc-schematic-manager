import React from 'react';
import './formInput.scss';

function FormInput({
  label, id, name, type, placeholder, required, onChange,
}) {
  return (
    <div className="input-group">
      <label htmlFor={id} name={name}>{label}</label>
      <input id={id} name={name} type={type} placeholder={placeholder} required={required} onChange={onChange} />
    </div>
  );
}

export default FormInput;
