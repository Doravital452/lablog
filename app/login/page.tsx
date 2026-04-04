import { Suspense } from "react";
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
        <LoginForm />
      </Suspense>
    </div>
  );
}
