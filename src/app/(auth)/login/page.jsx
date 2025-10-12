import { LoginForm } from "@/components/features/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Logg inn</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Eller{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              opprett en ny konto
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
