import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход",
  description: "Войдите в личный кабинет пансионата.",
};

export default async function LoginPage() {
  // Уже вошедшего пользователя сразу отправляем в кабинет
  const user = await getCurrentUser();
  if (user) {
    redirect("/cabinet");
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl justify-center px-6 py-16 md:py-24">
          <div className="w-full max-w-md animate-fade-up">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
