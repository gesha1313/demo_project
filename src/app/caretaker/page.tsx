import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaretakerWizard from "@/components/CaretakerWizard";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Услуга сиделки",
  description:
    "Анкета для подбора сиделки в Нижнем Новгороде: заполните форму — подберём свободную сиделку рядом с вами.",
};

export default async function CaretakerPage() {
  // Неавторизованного отправляем на вход с возвратом сюда же
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/caretaker");
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100">
        <div className="absolute -right-32 -top-24 h-96 w-96 animate-float rounded-full bg-blue-300/40 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="animate-fade-up mb-10 text-center md:text-left">
            
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
              Сиделка на дом в Нижнем Новгороде
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-slate-600 md:mx-0">
              Заполните короткую анкету — мы подберём свободную сиделку
              в вашем районе и покажем её на карте.
            </p>
          </div>

          <div className="flex animate-fade-up justify-center [animation-delay:150ms]">
            <CaretakerWizard userName={user.fullName?.trim() || user.email} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
