import { useState, useEffect } from 'react'
import './App.css'
import { requestFCMToken } from './generateFCMToken'

function App() {
  const [token, setToken] = useState("")
  useEffect(()=> {
    const fetchToken = async() => {
      const token = await requestFCMToken();
      console.log(token)
      setToken(token)
    }
    fetchToken();
  })
  
  return (
      <div>
        FCMToken: {token && token}
      </div>
  )
}

export default App
