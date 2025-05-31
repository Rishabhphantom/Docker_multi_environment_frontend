import React, { useState } from 'react';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      setResponseMessage(result.message);
    } catch (error) {
      setResponseMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </label>
      </div>
      <button type="submit">Submit</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
};

export default FormComponent;
