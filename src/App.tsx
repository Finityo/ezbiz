import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LLC from "./pages/LLC";
import CCorporation from "./pages/CCorporation"; 
import RegisteredAgent from "./pages/RegisteredAgent";
import SCorporation from "./pages/SCorporation";
import ProfessionalCorporation from "./pages/ProfessionalCorporation";
import NonprofitCorporation from "./pages/NonprofitCorporation";
import Partnership from "./pages/Partnership";
import SoleProprietorship from "./pages/SoleProprietorship";
import BusinessNameSearch from "./pages/BusinessNameSearch";
import DBAFiling from "./pages/DBAFiling";
import EINNumber from "./pages/EINNumber";
import OperatingAgreement from "./pages/OperatingAgreement";
import CorporateBylaws from "./pages/CorporateBylaws";
import Pricing from "./pages/Pricing";
import BusinessGuide from "./pages/BusinessGuide";
import StateRequirements from "./pages/StateRequirements";
import Consultation from "./pages/Consultation";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/form-llc" element={<LLC />} />
            <Route path="/c-corporation" element={<CCorporation />} />
            <Route path="/s-corporation" element={<SCorporation />} />
            <Route path="/professional-corporation" element={<ProfessionalCorporation />} />
            <Route path="/nonprofit-corporation" element={<NonprofitCorporation />} />
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/sole-proprietorship" element={<SoleProprietorship />} />
            <Route path="/registered-agent" element={<RegisteredAgent />} />
            <Route path="/name-search" element={<BusinessNameSearch />} />
            <Route path="/dba-filing" element={<DBAFiling />} />
            <Route path="/ein-number" element={<EINNumber />} />
            <Route path="/operating-agreement" element={<OperatingAgreement />} />
            <Route path="/corporate-bylaws" element={<CorporateBylaws />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/business-guide" element={<BusinessGuide />} />
            <Route path="/state-requirements" element={<StateRequirements />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
