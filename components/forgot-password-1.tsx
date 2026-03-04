"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(email);
    const res = await authClient.requestPasswordReset({
      email: email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    console.log(res);
    if (res.data?.status) {
      toast.success("Reset link sent to your email");
    } else {
      toast.error("Failed to send reset link");
    }
    setIsLoading(false);
  };
  return (
    <section className="bg-background flex grid min-h-screen grid-rows-[auto_1fr] px-4">
      <div></div>

      <div className="m-auto w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium">Forgot password?</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        <Card variant="outline" className="mt-6 p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
