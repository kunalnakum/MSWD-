import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/creatuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, location: credentials.geolocation })
    });
    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("Enter Valid Details");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} id="exampleInputPassword1" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Address</label>
          <input type="text" className="form-control" name='geolocation' value={credentials.geolocation} onChange={onChange} id="exampleInputPassword1" />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
        <div className="text-center mt-3">
          <Link to="/login" className='btn btn-danger'>Already a user?</Link>
        </div>
      </form>
    </div>
  );
}
