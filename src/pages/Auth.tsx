import SEOHead from "@/components/SEOHead";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/logo';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const resolveDestination = async (userId?: string) => {
    // 1. Explicit ?redirect= wins (used by segment landing pages, deep links).
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) return redirectParam;

    // 2. Route the user was originally trying to reach (protected route bounce).
    const from = location.state?.from?.pathname as string | undefined;
    if (from) return from;

    if (!userId) return "/dashboard";

    // 3. Admins go to /admin.
    const { data: adminRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (adminRow) return "/admin";

    // 4. Veterans (tagged at signup in user_metadata.customer_segment) land
    //    on their Order Documents area inside the dashboard.
    const { data: { user: current } } = await supabase.auth.getUser();
    const segment = (current?.user_metadata as any)?.customer_segment;
    if (segment === "veteran") return "/dashboard#documents";

    return "/dashboard";
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      resolveDestination(user.id).then((to) => navigate(to, { replace: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      const { data: { user: signedIn } } = await supabase.auth.getUser();
      const to = await resolveDestination(signedIn?.id);
      navigate(to, { replace: true });
    }
    
    setLoading(false);
  };


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, alreadyExists } = await signUp(email, password, firstName, lastName);

    if (!error && !alreadyExists) {
      setShowEmailVerification(true);
    }
    // If alreadyExists, the toast from useAuth surfaces the message;
    // user remains on the Auth page and can switch to the Sign In tab.

    setLoading(false);
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEOHead title="Sign In" description="Sign in to your EZ BIZ FILE SERVICE account." path="/auth" noIndex />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to verify your account and access your dashboard.
              </p>
              <p className="text-sm text-muted-foreground">
                After verifying, you can sign in with your credentials.
              </p>
              <Button 
                onClick={() => setShowEmailVerification(false)} 
                variant="outline" 
                className="w-full"
              >
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <h1 className="text-2xl font-bold mt-4">Welcome to EZ BIZ File Service</h1>
          <p className="text-muted-foreground">Sign in to manage your business formation</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {resetSent ? (
                    <p className="text-sm text-center text-primary">Reset email sent! Check your inbox.</p>
                  ) : (
                    <button
                      type="button"
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={async () => {
                        if (!email) return;
                        // Stash the active in-flight path (e.g. /order-flow/...) so
                        // ResetPassword can return the user there instead of dumping
                        // them at /dashboard.
                        try {
                          const from = location.state?.from?.pathname as string | undefined;
                          if (from && from.startsWith('/order')) {
                            sessionStorage.setItem('postAuthRedirect', from);
                          }
                        } catch { /* ignore */ }
                        await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        setResetSent(true);
                      }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Create a new account to get started with your business formation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;