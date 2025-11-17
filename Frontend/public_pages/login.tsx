import React from 'react'
import Button from '../src/components/Button'

export default function Login() {
  return (
    <div>
      <Button 
      color='blue'
        text='Click Me'
        onClick={() => alert('Button Clicked!')}

        />
    </div>
  )
}
