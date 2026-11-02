"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  LogIn,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";

import { toast } from "@/components/ui/toast";
import { signIn, signUp } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "login" | "register";
};

type PasswordRule = {
  label: string;
  test: (pw: string) => boolean;
};

const passwordRules: PasswordRule[] = [
  { label: "At least 6 characters", test: (pw) => pw.length >= 6 },
  { label: "One uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
];

function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  return null;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  function validateField(field: string, value: string): string {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
        return "";
      case "photoURL":
        if (!value.trim()) return "Photo URL is required.";
        if (!/^https?:\/\/.+/.test(value)) return "Must be a valid URL starting with http(s)://";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (isRegister) return validatePassword(value) ?? "";
        return "";
      default:
        return "";
    }
  }

  function handleBlur(field: string, value: string) {
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Run full validation before submit
    const newErrors: Record<string, string> = {};
    if (isRegister) {
      newErrors.name = validateField("name", name);
      newErrors.photoURL = validateField("photoURL", photoURL);
    }
    newErrors.email = validateField("email", email);
    newErrors.password = validateField("password", password);

    const hasErrors = Object.values(newErrors).some(Boolean);
    setFieldErrors(newErrors);

    if (hasErrors) {
      const firstError = Object.values(newErrors).find(Boolean) ?? "Please fix the errors above.";
      toast.add({
        type: "error",
        title: "Validation failed",
        description: firstError,
      });
      return;
    }

    setIsPending(true);

    try {
      const result = isRegister
        ? await signUp.email({ name: name.trim(), email: email.trim(), password, image: photoURL.trim() })
        : await signIn.email({ email: email.trim(), password });

      if (result.error) {
        const errorMessage =
          result.error.message ||
          (isRegister
            ? "Unable to create your account. Please try again."
            : "Unable to sign in. Please check your credentials.");
        setError(errorMessage);
        toast.add({
          type: "error",
          title: isRegister ? "Registration failed" : "Login failed",
          description: errorMessage,
        });
        return;
      }

      toast.add({
        type: "success",
        title: isRegister ? "Account created! 🎉" : "Welcome back! 👋",
        description: isRegister
          ? "Your account is ready. Please sign in."
          : "You are now signed in to UnityCare.",
      });
      router.replace(isRegister ? "/login" : "/");
      router.refresh();
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.add({
        type: "error",
        title: isRegister ? "Registration failed" : "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsPending(true);

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        const msg =
          result.error.message ||
          "Google sign-in is unavailable. Check the Google OAuth configuration.";
        setError(msg);
        toast.add({ type: "error", title: "Google sign-in failed", description: msg });
      }
    } catch (signInError) {
      const msg =
        signInError instanceof Error
          ? signInError.message
          : "Google sign-in is unavailable. Check the Google OAuth configuration.";
      setError(msg);
      toast.add({ type: "error", title: "Google sign-in failed", description: msg });
    } finally {
      setIsPending(false);
    }
  }

  const inputClass = (field: string) =>
    `h-12 w-full rounded-xl border bg-[#f8fafb] pl-11 pr-4 text-sm text-[#20242a] outline-none transition focus:ring-2 ${fieldErrors[field]
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
      : "border-[#dfe3e7] focus:border-[#0e9b86] focus:ring-[#0e9b86]/15"
    }`;

  const showPasswordRules = isRegister && password.length > 0;

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-[32px] font-extrabold tracking-tight text-[#14683f] sm:text-[36px]">
          {isRegister ? "Create Account" : "Login to UnityCare"}
        </h1>
        <p className="mt-2 text-[15px] text-[#737982]">Together, We Care.</p>
        <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-[#7ed957]" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#8b929b]"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                placeholder="Your full name"
                className={inputClass("name")}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
            )}
          </div>
        )}

        {isRegister && (
          <div>
            <label htmlFor="photoURL" className="sr-only">
              Photo URL
            </label>
            <div className="relative">
              <ImageIcon
                aria-hidden="true"
                className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#8b929b]"
              />
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                autoComplete="url"
                required
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                onBlur={(e) => handleBlur("photoURL", e.target.value)}
                placeholder="Photo URL (https://example.com/photo.jpg)"
                className={`${inputClass("photoURL")} pr-4`}
              />
            </div>
            {fieldErrors.photoURL && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.photoURL}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#8b929b]"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              placeholder="Email Address"
              className={inputClass("email")}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#8b929b]"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={isRegister ? 6 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              placeholder="Password"
              className={`${inputClass("password")} pr-12`}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#8b929b] hover:bg-black/5"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-[18px]" />
              ) : (
                <Eye aria-hidden="true" className="size-[18px]" />
              )}
            </button>
          </div>
          {fieldErrors.password && !showPasswordRules && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}

          {/* Live password strength rules for register */}
          {showPasswordRules && (
            <ul className="mt-2 space-y-1">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? "text-emerald-600" : "text-red-500"
                      }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="size-3.5 shrink-0" />
                    ) : (
                      <XCircle className="size-3.5 shrink-0" />
                    )}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Remember me + Forgot password (visual only for now) */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#20242a]">
            <input
              type="checkbox"
              name="remember"
              className="size-4 rounded border-[#dfe3e7] accent-[#157a45]"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-sm font-semibold text-[#14683f] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#157a45] text-base font-semibold text-white shadow-sm transition hover:bg-[#116b3b] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isPending
            ? isRegister
              ? "Creating account..."
              : "Signing in..."
            : isRegister
              ? "Create Account"
              : "Login"}
          {!isPending &&
            (isRegister ? (
              <ArrowRight aria-hidden="true" className="size-4" />
            ) : (
              <LogIn aria-hidden="true" className="size-4" />
            ))}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e7eaed]" />
        <span className="text-xs font-semibold tracking-wide text-[#8b929b]">OR</span>
        <div className="h-px flex-1 bg-[#e7eaed]" />
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleGoogleSignIn}
        className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#dfe3e7] bg-white text-sm font-semibold text-[#20242a] shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {/* Google icon */}
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-[#737982]">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#14683f] underline underline-offset-2"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#14683f] underline underline-offset-2"
            >
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
