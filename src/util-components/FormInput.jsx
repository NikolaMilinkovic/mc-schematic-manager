import React from 'react';
import './formInput.scss';

function FormInput({
  label, id, name, type, placeholder, required, onChange, text = '',
}) {
  return (
    <div className="input-group">
      <label htmlFor={id} name={name}>{label}</label>
      <input id={id} name={name} type={type} placeholder={placeholder} required={required} onChange={onChange} value={text} />
    </div>
  );
}

export default FormInput;
