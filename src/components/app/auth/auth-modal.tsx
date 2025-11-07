import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

interface AuthModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Authentication Modal Component
 *
 * Displays a modal with tabs for login and signup forms.
 * Used when the user needs to authenticate to access the app.
 *
 * @example
 * <AuthModal open={!session} />
 */
export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleSuccess = () => {
    // After successful auth, reload the page to get the new session
    window.location.href = "/app";
  };

  const handleContinueAsGuest = async () => {
    setIsGuestLoading(true);
    try {
      await authClient.signIn.anonymous();
      handleSuccess();
    } catch (error) {
      console.error("Failed to sign in as guest:", error);
      setIsGuestLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to continue.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm redirectTo="/app" onSuccess={handleSuccess} />
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <SignupForm redirectTo="/app" onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleContinueAsGuest}
          disabled={isGuestLoading}
        >
          {isGuestLoading ? "Loading..." : "Continue as Guest"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
