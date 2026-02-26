import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FeedbackWidget from "./components/FeedbackWidget";

// Lazy-loaded routes for code splitting
const LLC = lazy(() => import("./pages/LLC"));
const CCorporation = lazy(() => import("./pages/CCorporation"));
const RegisteredAgent = lazy(() => import("./pages/RegisteredAgent"));
const SCorporation = lazy(() => import("./pages/SCorporation"));
const ProfessionalCorporation = lazy(() => import("./pages/ProfessionalCorporation"));
const NonprofitCorporation = lazy(() => import("./pages/NonprofitCorporation"));
const Partnership = lazy(() => import("./pages/Partnership"));
const SoleProprietorship = lazy(() => import("./pages/SoleProprietorship"));
const BusinessNameSearch = lazy(() => import("./pages/BusinessNameSearch"));
const DBAFiling = lazy(() => import("./pages/DBAFiling"));
const EINNumber = lazy(() => import("./pages/EINNumber"));
const OperatingAgreement = lazy(() => import("./pages/OperatingAgreement"));
const CorporateBylaws = lazy(() => import("./pages/CorporateBylaws"));
const Pricing = lazy(() => import("./pages/Pricing"));
const BusinessGuide = lazy(() => import("./pages/BusinessGuide"));
const BusinessTemplates = lazy(() => import("./pages/BusinessTemplates"));
const StateRequirements = lazy(() => import("./pages/StateRequirements"));
const BusinessFilings = lazy(() => import("./pages/BusinessFilings"));
const Consultation = lazy(() => import("./pages/Consultation"));
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const EnhancedOrderFlow = lazy(() => import("./pages/EnhancedOrderFlow"));
const CaliforniaLLC = lazy(() => import("./pages/states/CaliforniaLLC"));
const DelawareLLC = lazy(() => import("./pages/states/DelawareLLC"));
const TexasLLC = lazy(() => import("./pages/states/TexasLLC"));
const NewYorkLLC = lazy(() => import("./pages/states/NewYorkLLC"));
const NewYorkCorporation = lazy(() => import("./pages/states/NewYorkCorporation"));
const FloridaLLC = lazy(() => import("./pages/states/FloridaLLC"));
const FloridaCorporation = lazy(() => import("./pages/states/FloridaCorporation"));
const NevadaLLC = lazy(() => import("./pages/states/NevadaLLC"));
const NevadaCorporation = lazy(() => import("./pages/states/NevadaCorporation"));
const WyomingLLC = lazy(() => import("./pages/states/WyomingLLC"));
const WyomingCorporation = lazy(() => import("./pages/states/WyomingCorporation"));
const OhioLLC = lazy(() => import("./pages/states/OhioLLC"));
const IllinoisLLC = lazy(() => import("./pages/states/IllinoisLLC"));
const GeorgiaLLC = lazy(() => import("./pages/states/GeorgiaLLC"));
const VirginiaLLC = lazy(() => import("./pages/states/VirginiaLLC"));
const ColoradoLLC = lazy(() => import("./pages/states/ColoradoLLC"));
const WashingtonLLC = lazy(() => import("./pages/states/WashingtonLLC"));
const AnnualReport = lazy(() => import("./pages/AnnualReport"));
const ComplianceServices = lazy(() => import("./pages/ComplianceServices"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}

function App() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
           <BrowserRouter>
            <AnalyticsWrapper>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
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
              <Route path="/business-templates" element={<BusinessTemplates />} />
              <Route path="/state-requirements" element={<StateRequirements />} />
              <Route path="/business-filings" element={<BusinessFilings />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/about" element={<About />} />
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
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            <FeedbackWidget />
            </AnalyticsWrapper>
         </BrowserRouter>
       </AuthProvider>
     </TooltipProvider>
   </QueryClientProvider>
   );
 }

export default App;