"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form-nextjs";
import z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const formSchema = z
  .object({
    email: z.string().email().min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async (data) => {
      const res = await authClient.resetPassword({
        newPassword: data.value.password,
        token: token ?? "",
      });
      if (res.data?.status) {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error("Failed to reset password");
      }
    },
  });
  return (
    <section className="bg-background flex min-h-screen px-4 py-16 md:py-24">
      <div className="m-auto w-full max-w-xs">
        <div className="text-center">
          <Link href="/" aria-label="go home" className="inline-block py-3">
            <Logo className="mx-auto w-fit" />
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-medium">
            Reset password
          </h1>
        </div>

        <form onSubmit={
            (e) => {
              e.preventDefault();
              form.handleSubmit();
            }
          } className="my-8 space-y-5">
          <div className="space-y-5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <form.Field
              name="email"
              children={(field) => {
                return (
                  <>   <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                />
                {!field.state.meta.isValid && (
                    <p className="text-red-500">
                      {field.state.meta.errors.at(0)?.message}
                    </p>
                  )}
                </>
               
                );
              }}
            />
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <form.Field
              name="password"
              children={(field) => {
                return (
                  <>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                    />
                    {!field.state.meta.isValid && (
                      <p className="text-red-500">
                        {field.state.meta.errors.at(0)?.message}
                      </p>
                    )}
                  </>
                );
              }}
            />
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </Label>
            <form.Field
              name="confirmPassword"
              children={(field) => {
                return (
                <>  <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
              />
              {!field.state.meta.isValid && (
                    <p className="text-red-500">
                      {field.state.meta.errors.at(0)?.message}
                    </p>
                  )}
                </>
                );
              }}
            />
          </div>

          <Button className="w-full mt-8" type="submit">
            Reset Password
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-center text-sm">
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
