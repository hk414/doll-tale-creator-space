
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import DollViewer from "./pages/DollViewer";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import { BrandDashboard } from "./pages/BrandDashboard";
import { BrandMarketing } from "./pages/BrandMarketing";
import { BrandAnalytics } from "./pages/BrandAnalytics";
import { BrandProfile } from "./pages/BrandProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/doll/:id" element={<DollViewer />} />
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
          <Route path="/brand/marketing" element={<BrandMarketing />} />
          <Route path="/brand/analytics" element={<BrandAnalytics />} />
          <Route path="/brand/profile" element={<BrandProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
