import { Suspense } from "react";
import { GoogleOAuthSection } from "@/components/google-oauth-section";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center bg-white px-4 py-12">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-sm text-center text-sm text-neutral-500">
            Loading…
          </div>
        }
      >
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900">LabLog</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Sign in to your account
            </p>
          </div>
          <GoogleOAuthSection />
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
