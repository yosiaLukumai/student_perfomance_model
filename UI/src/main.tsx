import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom'
import NotFound from './pages/NotFound'
import StudentForm from './pages/Land/student'

const router: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <StudentForm />,
      },
    ]
  }
]

const browserRouter = createBrowserRouter(router)

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
              <RouterProvider router={browserRouter} />
    </StrictMode>
  )
} else {
  console.error('Root element not found')
}

export default router