import React from 'react';
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
import BusinessFilings from "./pages/BusinessFilings";
import Consultation from "./pages/Consultation";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import OrderNow from "./pages/OrderNow";
import BusinessFormation from "./pages/BusinessFormation";
import EnhancedOrderFlow from "./pages/EnhancedOrderFlow";
import CaliforniaLLC from "./pages/states/CaliforniaLLC";
import DelawareLLC from "./pages/states/DelawareLLC";
import TexasLLC from "./pages/states/TexasLLC";
import NewYorkLLC from "./pages/states/NewYorkLLC";
import NewYorkCorporation from "./pages/states/NewYorkCorporation";
import FloridaLLC from "./pages/states/FloridaLLC";
import FloridaCorporation from "./pages/states/FloridaCorporation";
import NevadaLLC from "./pages/states/NevadaLLC";
import NevadaCorporation from "./pages/states/NevadaCorporation";
import WyomingLLC from "./pages/states/WyomingLLC";
import WyomingCorporation from "./pages/states/WyomingCorporation";
import OhioLLC from "./pages/states/OhioLLC";
import IllinoisLLC from "./pages/states/IllinoisLLC";
import GeorgiaLLC from "./pages/states/GeorgiaLLC";
import VirginiaLLC from "./pages/states/VirginiaLLC";
import ColoradoLLC from "./pages/states/ColoradoLLC";
import WashingtonLLC from "./pages/states/WashingtonLLC";
import AnnualReport from "./pages/AnnualReport";
import ComplianceServices from "./pages/ComplianceServices";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";

function App() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
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
            <Route path="/business-filings" element={<BusinessFilings />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/about" element={<About />} />
            <Route path="/order-now" element={<OrderNow />} />
            <Route path="/business-formation" element={<BusinessFormation />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/order-flow" element={<EnhancedOrderFlow />} />
            <Route path="/state/california/llc" element={<CaliforniaLLC />} />
            <Route path="/state/delaware/llc" element={<DelawareLLC />} />
            <Route path="/state/texas/llc" element={<TexasLLC />} />
            <Route path="/state/new-york/llc" element={<NewYorkLLC />} />
            <Route path="/state/new-york/corporation" element={<NewYorkCorporation />} />
            <Route path="/state/florida/llc" element={<FloridaLLC />} />
            <Route path="/state/florida/corporation" element={<FloridaCorporation />} />
            <Route path="/state/nevada/llc" element={<NevadaLLC />} />
            <Route path="/state/nevada/corporation" element={<NevadaCorporation />} />
            <Route path="/state/wyoming/llc" element={<WyomingLLC />} />
            <Route path="/state/wyoming/corporation" element={<WyomingCorporation />} />
            <Route path="/state/ohio/llc" element={<OhioLLC />} />
            <Route path="/state/illinois/llc" element={<IllinoisLLC />} />
            <Route path="/state/georgia/llc" element={<GeorgiaLLC />} />
            <Route path="/state/virginia/llc" element={<VirginiaLLC />} />
            <Route path="/state/colorado/llc" element={<ColoradoLLC />} />
            <Route path="/state/washington/llc" element={<WashingtonLLC />} />
            <Route path="/annual-report" element={<AnnualReport />} />
            <Route path="/compliance" element={<ComplianceServices />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
         </BrowserRouter>
       </AuthProvider>
     </TooltipProvider>
   </QueryClientProvider>
   );
 }

export default App;
