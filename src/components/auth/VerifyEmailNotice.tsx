import { useState } from "react";
import { Mail, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VerifyEmailNoticeProps {
  email: string;
  onSignOut?: () => void;
  compact?: boolean;
}

const VerifyEmailNotice = ({ email, onSignOut, compact = false }: VerifyEmailNoticeProps) => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setSending(false);
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Verification email sent", description: `Check ${email} for the link.` });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut?.();
  };

  const inner = (
    <>
      <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Mail className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">Verify your email</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        We sent a verification link to <span className="font-medium text-foreground">{email}</span>.
        Click the link in that email to activate your account and access your dashboard.
      </p>
      <div className="flex flex-col gap-2">
        <Button onClick={handleResend} disabled={sending} variant="outline" className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${sending ? "animate-spin" : ""}`} />
          {sending ? "Sending..." : "Resend verification email"}
        </Button>
        <Button onClick={handleSignOut} variant="ghost" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </>
  );

  if (compact) {
    return <div className="max-w-md mx-auto py-6">{inner}</div>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="sr-only">Verify your email</CardTitle>
          <CardDescription className="sr-only">Email verification required</CardDescription>
        </CardHeader>
        <CardContent>{inner}</CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailNotice;
