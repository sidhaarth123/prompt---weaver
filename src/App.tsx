import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import ImageGenerator from "./pages/ImageGenerator";
import WebsiteGenerator from "./pages/WebsiteGenerator";
import VideoGenerator from "./pages/VideoGenerator";
import HistoryPage from "./pages/History";
import Library from "./pages/Library";
import Presets from "./pages/Presets";
import Settings from "./pages/Settings";
import PricingPage from "@/components/pricing/PricingView";
import Docs from "./pages/Docs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Public pages */}
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected pages */}
            <Route
              path="/image-generator"
              element={
                <ProtectedRoute>
                  <ImageGenerator />
                </ProtectedRoute>
              }
            />
            {/* Redirect old generator route */}
            <Route
              path="/generator"
              element={
                <ProtectedRoute>
                  <ImageGenerator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/website-generator"
              element={
                <ProtectedRoute>
                  <WebsiteGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/video-generator"
              element={
                <ProtectedRoute>
                  <VideoGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/presets"
              element={
                <ProtectedRoute>
                  <Presets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
