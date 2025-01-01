'use client';

import { LoginForm } from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;