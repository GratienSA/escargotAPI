'use client';

import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;