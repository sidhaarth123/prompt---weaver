import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages for performance
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const DashboardAbout = lazy(() => import("./pages/DashboardAbout"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const BannerGenerator = lazy(() => import("./pages/BannerGenerator"));
const ImageGenerator = lazy(() => import("./pages/ImageGenerator"));
const WebsiteGenerator = lazy(() => import("./pages/WebsiteGenerator"));
const AdGenerator = lazy(() => import("./pages/AdGenerator"));
const VideoGenerator = lazy(() => import("./pages/VideoGenerator"));
const HistoryPage = lazy(() => import("./pages/History"));
const Library = lazy(() => import("./pages/Library"));
const Presets = lazy(() => import("./pages/Presets"));
const Settings = lazy(() => import("./pages/Settings"));
// Pricing is already a component import if strictly following file path, but user had it import from components/pricing/PricingView sometimes?
// The file is src/components/pricing/PricingView.tsx but previous import was import PricingPage from "@/components/pricing/PricingView";
const PricingPage = lazy(() => import("@/components/pricing/PricingView"));
const PublicPricing = lazy(() => import("./pages/PublicPricing"));
const Docs = lazy(() => import("./pages/Docs"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Fallback loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background text-primary relative">
    <div className="flex flex-col items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />

              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Public pages */}
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/plans" element={<PublicPricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

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
                path="/banner-generator"
                element={
                  <ProtectedRoute>
                    <BannerGenerator />
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
                path="/ad"
                element={
                  <ProtectedRoute>
                    <AdGenerator />
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
              <Route
                path="/app/about"
                element={
                  <ProtectedRoute>
                    <DashboardAbout />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
