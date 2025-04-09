import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth, useArticles } from '../contexts/UserContext';

// Import your page components
import Home from '../pages/Home.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import Login from '../pages/Login.tsx';
import Blog from '../pages/Blog.tsx';
import About from '../pages/About.tsx';
import Help from '../pages/Help.tsx';
import NotFound from '../pages/NotFound.tsx';
import Editor from '../pages/Editor.jsx';
import UserProfile from '../pages/UserProfile.tsx';
import UserRelationships from '../pages/UserRelationships.tsx';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loggedIn, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="container mt-5 pt-5">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const EditArticle = () => {
  const { id } = useParams();
  const { articles } = useArticles();
  const navigate = useNavigate();
  
  // Find the article to edit
  const articleToEdit = articles.find(article => article.id === id);
  
  if (!articleToEdit) {
    return <div className="container mt-5 pt-5">Article not found</div>;
  }
  
  return (
    <Editor 
      article={articleToEdit}
      onSave={() => navigate('/dashboard')}
      onCancel={() => navigate('/dashboard')}
    />
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/editor" 
        element={
          <ProtectedRoute>
            <Editor 
              article={undefined} 
              onSave={() => navigate('/dashboard')} 
              onCancel={() => navigate('/dashboard')} 
            />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/editor/:id" 
        element={
          <ProtectedRoute>
            <EditArticle />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/relationships"
        element={
          <ProtectedRoute>
            <UserRelationships />
          </ProtectedRoute>
        }
      />
      
      <Route path="/:username_uri" element={<UserProfile />} />
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;