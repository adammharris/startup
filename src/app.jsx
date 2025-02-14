import './App.css'
import Navigation from './navigation/navigation'

function App() {
  return (
    <div className="body bg-secondary">
        <Navigation />

        <footer className="bg-dark text-white-50">
            <div className="container-fluid">
                <span className="text-reset">Made by Adam Harris! </span>
                <a className="text-reset" href="https://github.com/adammharris/startup">Github</a>
            </div>
        </footer>
        
    </div>
  );
}

export default App;