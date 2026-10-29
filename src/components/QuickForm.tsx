import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import LeadForm from "./LeadForm";

export default function QuickForm() {
  return (
    <section id="request" className="section-band relative py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          eyebrow="Быстрая заявка"
          title="Оставьте заявку — остальное сделаем мы"
          description="Короткая форма: имя, телефон, удобное время и суть проблемы."
        />
        <Reveal className="mt-10" delay={120}>
          <LeadForm variant="quick" />
        </Reveal>
      </div>
    </section>
  );
}
