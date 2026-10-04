import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Админ-панель",
  description: "Заявки, пользователи и горячая линия пансионата.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!isStaff(user)) {
    redirect("/cabinet");
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="animate-fade-up flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                {user.role === "admin" ? "Администратор" : "Сотрудник"}
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
                Панель управления
              </h1>
              <p className="mt-2 text-slate-600">
                {user.role === "admin"
                  ? "Все заявки, пользователи и обращения в горячую линию."
                  : "Заявки, назначенные вам, и горячая линия."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/cabinet"
                className="btn-glass-ghost rounded-full px-6 py-3 text-sm font-semibold"
              >
                Личный кабинет
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-10 animate-fade-up [animation-delay:150ms]">
            <AdminDashboard role={user.role === "admin" ? "admin" : "employee"} myId={user.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
