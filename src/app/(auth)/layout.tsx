import { AuthBrand } from "@/components/auth/auth-brand";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Branding panel — left */}
      <AuthBrand />

      {/* Form panel — right */}
      <div className="flex items-center justify-center bg-[#fbfcfb] px-4 py-10 sm:px-8 lg:py-14 dark:bg-[#0a1512]">
        <div className="w-full max-w-[460px]">{children}</div>
      </div>
    </div>
  );
}
