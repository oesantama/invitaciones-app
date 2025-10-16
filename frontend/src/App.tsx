import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import HomePage from './pages/HomePage';
import InvitationView from './pages/InvitationView';
import ConfirmationPage from './pages/ConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import EventCreator from './pages/EventCreator';
import AttendanceScanner from './pages/AttendanceScanner';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/invitation/:eventId/:guestId" element={<InvitationView />} />
              <Route path="/confirm/:eventId/:guestId" element={<ConfirmationPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/create" element={
                <ProtectedRoute>
                  <EventCreator />
                </ProtectedRoute>
              } />
              <Route path="/admin/scanner/:eventId" element={
                <ProtectedRoute>
                  <AttendanceScanner />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;