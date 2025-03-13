import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArticlesProvider } from "./contexts/ArticlesContext";  
import "./App.css";
import Navigation from "./navigation/Navigation";
import Home from "./home/Home";
import Login from "./login/Login";
import Blog from "./blog/Blog";
import About from "./about/About";
import Help from "./help/Help";
import Footer from "./navigation/Footer";
import Dashboard from "./dashboard/Dashboard";
import Editor from "./editor/Editor";

const NotFound: React.FC = () => {
  return (
    <main className="container-fluid text-center m-5 p-5">
      404: Return to sender. Address unknown.
    </main>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ArticlesProvider>
      <div className="App d-flex flex-column min-vh-100 pt-4 pb-5 bg-primary">
        <Navigation />
        <div className="body flex-grow-1 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </div>
        <Footer />
      </div>
      </ArticlesProvider>
    </BrowserRouter>
  );
};

export default App;
