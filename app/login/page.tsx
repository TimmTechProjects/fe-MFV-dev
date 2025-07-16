import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <Suspense
      fallback={<div className="text-white">Loading login form...</div>}
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
export const metadata = {
  title: "Login",
  description: "Login to your account",
};
