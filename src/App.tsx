import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
      <UserProvider>
        <Navigation />
        <AppRoutes />
        <Footer />
      </UserProvider>
      </div>
    </Router>
  );
}

export default App;
