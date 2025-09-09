import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Scanner from "./pages/Scanner";
import SimpleAR from "./pages/SimpleAR";
import TrueAR from "./pages/TrueAR";
import RealAR from "./pages/RealAR";
import NFTAR from "./pages/NFTAR";
import Auth from "./pages/Auth";
import Mobile from "./pages/Mobile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mobile" element={<Mobile />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/simple-ar" element={<SimpleAR />} />
            <Route path="/true-ar" element={<TrueAR />} />
            <Route path="/real-ar" element={<RealAR />} />
            <Route path="/nft-ar" element={<NFTAR />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
