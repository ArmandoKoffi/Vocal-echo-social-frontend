import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";

// Pages
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotificationDetail from "./pages/NotificationDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import Search from "./pages/Search";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const App = () => {
  // Créer une nouvelle instance de QueryClient à l'intérieur du composant
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Redirection par défaut vers la page landing */}
                  <Route
                    path="/"
                    element={<Navigate to="/landing" replace />}
                  />

                  {/* Routes publiques */}
                  <Route
                    path="/landing"
                    element={
                      <GuestGuard>
                        <Landing />
                      </GuestGuard>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <GuestGuard>
                        <Login />
                      </GuestGuard>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <GuestGuard>
                        <Register />
                      </GuestGuard>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <GuestGuard>
                        <ForgotPassword />
                      </GuestGuard>
                    }
                  />
                  <Route
                    path="/terms-of-service"
                    element={<TermsOfService />}
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                  {/* Routes protégées */}
                  <Route
                    path="/home"
                    element={
                      <AuthGuard>
                        <Index />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <AuthGuard>
                        <Profile />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <AuthGuard>
                        <Notifications />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/notifications/:id"
                    element={
                      <AuthGuard>
                        <NotificationDetail />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AuthGuard>
                        <Admin />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <AuthGuard>
                        <Settings />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/settings/password"
                    element={
                      <AuthGuard>
                        <ChangePassword />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <AuthGuard>
                        <Search />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <AuthGuard>
                        <FAQ />
                      </AuthGuard>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <AuthGuard>
                        <Contact />
                      </AuthGuard>
                    }
                  />

                  {/* Route par défaut */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App; 
