import React, { useState } from "react"
import { signup, login } from "../services/api"

function AuthPage() {

  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT"
  })
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      if(isLogin){
        const res = await login({
          email: form.email,
          password: form.password
        })
        console.log(res)
        setMessage("Login successful")
      }else{
        const res = await signup(form)
        console.log(res)
        setMessage("Signup successful")
      }
    } catch (err) {
      console.error(err)
      setMessage("Error: Something went wrong")
    }
  }

  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input  type="text"  name="name"  placeholder="Name" value={form.name}
              onChange={handleChange}
              required/>
            <br />

            <label>
              <input type="radio" name="role"  value="STUDENT" checked={form.role === "STUDENT"} onChange={handleChange}/> Student
            </label>

            <label style={{marginLeft: "10px"}}>
              <input type="radio" name="role" value="ADMIN" checked={form.role === "ADMIN"} onChange={handleChange} /> Admin
            </label>

            <br />
          </>
        )}

        <input 
          type="email" 
          name="email" 
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input  type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
        <br />

        <button type="submit">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
      </button>
    </div>
  )
}

export default AuthPage
