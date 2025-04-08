import { Outlet } from 'react-router-dom';
import { NoInternet } from './pages/NoInternet';
import { Toaster } from 'sonner';
import './index.css'


function App() {

  return (
    <>
      <NoInternet>
        <Toaster />
        <main className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Student Performance Prediction</h1>
          <Outlet />
        </main>
      </NoInternet>
    </>
  );
}

export default App;