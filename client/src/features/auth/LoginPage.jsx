import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Seo } from "../../components/common/Seo";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { loginSchema } from "../../schemas/authSchema";
import { useAuthStore } from "../../store/authStore";
import { useLogin } from "./useAuth";
import { TextReveal } from "../../components/animations/TextReveal";

export function LoginPage() {
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (login.isSuccess) {
      setSession(login.data.data);
      navigate(location.state?.from ?? "/admin", { replace: true });
    }
  }, [location.state, login.data, login.isSuccess, navigate, setSession]);

  if (token) {
    return <Navigate replace to="/admin" />;
  }

  const onSubmit = (values) => {
    login.mutate(values);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-6">
      <Seo title="Admin Login" />
      <form
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 shadow-2xl sm:p-9"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-cyan-400">
            <TextReveal as="span" variant="label">
              Portfolio CMS
            </TextReveal>
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">
            <TextReveal as="span" variant="heading">
              Sign in
            </TextReveal>
          </h1>
          <TextReveal as="p" variant="body" className="mt-3 text-sm leading-6 text-slate-300">
            Use an authorized administrator account to manage public platform content.
          </TextReveal>
        </div>

        <Input
          autoComplete="email"
          error={errors.email?.message}
          label="Email address"
          placeholder="admin@murtazazaman.com"
          required
          type="email"
          {...register("email")}
        />

        <Input
          autoComplete="current-password"
          error={errors.password?.message}
          label="Password"
          placeholder="••••••••"
          required
          type="password"
          {...register("password")}
        />

        {login.isError && (
          <div
            aria-live="assertive"
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
            role="alert"
          >
            {login.error?.message || "Unable to sign in with those credentials. Please check your email and password."}
          </div>
        )}

        <Button
          className="w-full"
          disabled={login.isPending || isSubmitting}
          type="submit"
        >
          {login.isPending || isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
        </Button>
      </form>
    </div>
  );
}