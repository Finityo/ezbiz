import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, LogIn, UserPlus } from "lucide-react";

import VerifyEmailNotice from "@/components/auth/VerifyEmailNotice";

interface AccountStepProps {
  onAuthenticated: () => void;
}

const AccountStep = ({ onAuthenticated }: AccountStepProps) => {
  const { user, signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Sign Up state
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Sign In state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  // Already logged in
  if (user) {
    if (!user.email_confirmed_at) {
      return <VerifyEmailNotice email={user.email || ""} compact />;
    }
    return (
      <div className="text-center py-8 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold">You're signed in!</h3>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
        <Button onClick={onAuthenticated} size="lg">
          Continue to Review
        </Button>
      </div>
    );
  }

  const handleSignUp = async () => {
    if (signUpData.password !== signUpData.confirmPassword) {
      return; // Form validation handles this visually
    }
    setLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.firstName, signUpData.lastName);
    setLoading(false);
    // Do NOT advance — user must verify email first. The "Already logged in"
    // branch above will render the VerifyEmailNotice once the session is set.
    if (error) return;
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    setLoading(false);
    if (!error) onAuthenticated();
  };

  const signUpValid = signUpData.firstName && signUpData.lastName && signUpData.email &&
    signUpData.password.length >= 8 && signUpData.password === signUpData.confirmPassword && agreed;

  const signInValid = signInData.email && signInData.password;

  return (
    <div className="max-w-md mx-auto">
      <Tabs defaultValue="signup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Create Account
          </TabsTrigger>
          <TabsTrigger value="signin" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Sign In
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signup" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="su-first">First Name *</Label>
              <Input id="su-first" value={signUpData.firstName}
                onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="su-last">Last Name *</Label>
              <Input id="su-last" value={signUpData.lastName}
                onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="su-email">Email *</Label>
            <Input id="su-email" type="email" value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="su-pass">Password * (min 8 characters)</Label>
            <Input id="su-pass" type="password" value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="su-confirm">Confirm Password *</Label>
            <Input id="su-confirm" type="password" value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} />
            {signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
              <p className="text-sm text-destructive mt-1">Passwords don't match</p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(c) => setAgreed(c === true)} className="mt-1" />
            <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
              I agree to the <a href="/terms" className="text-primary underline" target="_blank">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-primary underline" target="_blank">Privacy Policy</a>
            </Label>
          </div>
          <Button onClick={handleSignUp} disabled={!signUpValid || loading} className="w-full" size="lg">
            {loading ? "Creating Account..." : "Create Account & Continue"}
          </Button>
        </TabsContent>

        <TabsContent value="signin" className="space-y-4">
          <div>
            <Label htmlFor="si-email">Email</Label>
            <Input id="si-email" type="email" value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="si-pass">Password</Label>
            <Input id="si-pass" type="password" value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })} />
          </div>
          <Button onClick={handleSignIn} disabled={!signInValid || loading} className="w-full" size="lg">
            {loading ? "Signing In..." : "Sign In & Continue"}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountStep;
