import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Социальная программа",
  description:
    "Государственная социальная поддержка: реестр поставщиков социальных услуг, компенсации и льготное обслуживание.",
};

export default function SocialPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader
          eyebrow="Социальная программа"
          title="Государственная поддержка ухода"
          description="Рассказываем, как получить уход по социальным программам, и помогаем оформить всё за вас."
        />

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <div className="glass-strong rounded-[2rem] p-8 md:p-12">
                <div className="space-y-5 leading-8 text-slate-600">
                  <p>
                    Мы работаем в системе государственного заказа социальных услуг и включены в
                    <span className="font-semibold text-brand"> Реестр поставщиков социальных услуг</span>.
                    Это значит, что часть стоимости ухода можно компенсировать за счёт государства.
                  </p>
                  <p>
                    Для пожилых людей и людей с ограничениями здоровья действуют программы:
                    надомное обслуживание по закону 442-ФЗ, компенсация части платы за уход,
                    сопровождаемое проживание, бесплатные средства реабилитации по ИПРА.
                  </p>
                  <p>
                    Наш менеджер бесплатно проверит, какие программы подходят именно вашей семье,
                    поможет собрать документы и подать заявление. Обычно это экономит от 30 до 100%
                    стоимости ухода в зависимости от категории льготы.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="btn-glass-primary mt-8 inline-block rounded-full px-8 py-3.5 text-sm font-semibold"
                >
                  Обсудить с менеджером
                </Link>
                <p className="mt-3 text-xs text-slate-600">
                  Менеджер свяжется после регистрации в личном кабинете
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
