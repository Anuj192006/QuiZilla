import React, { useState } from "react"
import { signup, login } from "../services/api"
import { useNavigate } from "react-router-dom"

function AuthPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    try {
      // ---------------------------- LOGIN ----------------------------
      if (isLogin) {
        const res = await login({
          email: form.email,
          password: form.password
        })

        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))

        navigate("/dashboard")
        return
      }

      // ---------------------------- SIGNUP ----------------------------
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password
      })

      navigate("/dashboard")

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
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
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

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
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
