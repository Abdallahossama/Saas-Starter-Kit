"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { signInUser } from "@/server/users";
import { useForm } from "@tanstack/react-form-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

export default function Login() {
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email().min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async (data) => {
      const res = await signInUser(data.value.email, data.value.password);
      if (res.success) {
        toast.success("User created successfully");
        router.push("/");
      } else {
        toast.error("Failed to create user");
      }
    },
  });

  return (
    <section className="bg-background flex grid min-h-screen grid-rows-[auto_1fr] px-4">
      <div></div>

      <div className="m-auto w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Sign in to your account to continue
          </p>
        </div>
        <Card variant="outline" className="mt-6 p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            name="sign-in-form"
            className="space-y-5"
            id="sign-in-form"
          >
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <form.Field
                name="email"
                children={(field) => {
                  return (
                    <>
                      <Input
                        type={field.name}
                        id={field.name}
                        name={field.name}
                        placeholder="you@example.com"
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                        required
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Link
                  href="/forget-password"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <form.Field
                name="password"
                children={(field) => {
                  return (
                    <>
                      <Input
                        type={field.name}
                        id={field.name}
                        name={field.name}
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

            <Button className="w-full" type="submit" form="sign-in-form">
              Sign In
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={async () => {
                const res = await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
          </form>
        </Card>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
