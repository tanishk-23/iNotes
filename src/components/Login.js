import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password:""})
    let history = useHistory();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password}) 
          });
          const json = await response.json(); 
          console.log(json);
          if(json.success)
          {
            localStorage.setItem('token',json.authtoken)
            history.push('/')
            props.showAlert("Login Successful","success")
          }
          else{
              props.showAlert("invalid credentials","danger")
          }
    }
    const onChange = (e) =>{
        setcredentials({...credentials,[e.target.name]:e.target.value})
      }
    
  return (
    <div className="container mt-3">
      <h2>Login to iNotes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="Email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="Password"
            name="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <button type="submit"  className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
