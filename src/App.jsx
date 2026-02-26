import { RouterProvider } from 'react-router-dom'
import './App.css'
import { routes } from './Routing/AppRouting'



export default function App() {
  
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

