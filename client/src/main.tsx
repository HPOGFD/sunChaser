import ReactDOM from 'react-dom/client';



import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import WeatherSearch from './pages/WeatherPage.tsx';
import  ErrorPage from './pages/ErrorPage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <WeatherSearch />,
      },
     
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<RouterProvider router={router} />);
}
