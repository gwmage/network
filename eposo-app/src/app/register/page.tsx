```typescript
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one letter, one number, and one special character.');
    } else {
      setPasswordError('');
    }
  };

  const validateName = (name: string) => {
    if (name.length < 2) {
      setNameError('Name must be at least 2 characters long');
    } else {
      setNameError('');
    }
  };


  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{10,15}$/; // Adjust regex as needed
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('Invalid phone number format');
    } else {
      setPhoneNumberError('');
    }
  };

  return (
    <form>
      <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }} />
       {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

      <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }} />
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

      <input type="text" placeholder="Name" value={name} onChange={(e) => { setName(e.target.value); validateName(e.target.value); }} />
      {nameError && <p style={{ color: 'red' }}>{nameError}</p>}

      <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); validatePhoneNumber(e.target.value); }} />
      {phoneNumberError && <p style={{ color: 'red' }}>{phoneNumberError}</p>}

      <button type="submit">Register</button>
    </form>
  );
}
```