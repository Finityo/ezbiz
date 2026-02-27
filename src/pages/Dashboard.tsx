import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderStatusCard from "@/components/dashboard/OrderStatusCard";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import PaymentHistory from "@/components/dashboard/PaymentHistory";
import { User, FileText, CreditCard, Settings, CheckCircle, PartyPopper, X } from "lucide-react";
import { toast } from "sonner";
import { trackPurchase } from "@/lib/analytics";

interface Order {
  id: string;
  businessName: string;
  entityType: string;
  state: string;
  status: 'pending' | 'processing' | 'filed' | 'completed' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  package: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const isCheckoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      fetchUserData();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isCheckoutSuccess) {
      setShowSuccess(true);
      // Fire GA4 purchase event on successful Stripe return
      trackPurchase('stripe_checkout_' + Date.now(), 0, 'USD');
      // Remove query param from URL without reload
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("checkout");
      setSearchParams(newParams, { replace: true });
    }
  }, [isCheckoutSuccess]);

  const fetchUserData = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('business_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Transform data to match Order interface
      const transformedOrders: Order[] = (ordersData || []).map(order => {
        const appData = typeof order.application_data === 'object' && order.application_data !== null 
          ? order.application_data as any 
          : {};
        
        return {
          id: order.id,
          businessName: order.business_name,
          entityType: order.business_type,
          state: order.state,
          status: order.status as Order['status'],
          submittedDate: order.created_at,
          lastUpdated: order.updated_at || order.created_at,
          package: appData.package || 'Standard',
          documents: appData.documents || []
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Checkout Success Banner */}
          {showSuccess && (
            <div className="mb-6 relative rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                    Payment Successful! <PartyPopper className="h-5 w-5" />
                  </h2>
                  <p className="text-green-700 dark:text-green-300 mt-1">
                    Your order has been received and is now being processed. You can track its progress below.
                  </p>
                  {orders.length > 0 && (
                    <div className="mt-3 text-sm text-green-600 dark:text-green-400 space-y-1">
                      <p><strong>Business:</strong> {orders[0].businessName}</p>
                      <p><strong>State:</strong> {orders[0].state} • <strong>Package:</strong> {orders[0].package}</p>
                      <p><strong>Status:</strong> {orders[0].status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.first_name || 'User'}
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your business formations and account
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your business formation journey today
                  </p>
                  <Button onClick={() => navigate('/order-flow')}>
                    Start New Order
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map(order => (
                    <OrderStatusCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              {profile && user && (
                <ProfileEditor 
                  profile={profile} 
                  userId={user.id}
                  onUpdate={fetchUserData}
                />
              )}
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <PaymentHistory />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account preferences and security settings.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
