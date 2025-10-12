import { SignUpForm } from "@/components/features/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Opprett konto</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Eller{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              logg inn på eksisterende konto
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
