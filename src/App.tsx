import { Button } from '@/ui/button.tsx'
import React from 'react'

function App() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    alert('Hello World')
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-7xl">
          <Button type="button" onClick={handleClick}>
            Click
          </Button>
        </div>
      </div>
    </>
  )
}

export default App
