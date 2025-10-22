import type React from 'react'
import { MyComponent } from './components/my-component.tsx'
import { Button } from '@/ui/button.tsx'

function App() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    alert('Hello World')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-7xl">
        <Button type="button" onClick={handleClick}>
          Click
        </Button>
        <MyComponent />
      </div>
    </div>
  )
}

export default App
