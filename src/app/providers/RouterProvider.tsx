import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from '@/app/routes';

export function RouterProvider() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppRouter />
    </Router>
  );
}
