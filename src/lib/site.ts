export const site = {
  name: "Патронаж Народный",
  tagline: "Забота и поддержка",
  phone: "+7 (903) 600-60-80",
  phoneHref: "tel:+79036006080",
  email: "sarkana999@gmail.com",
  address: "г. Нижний Новгород, ул. Тихая, 12",
  hours: "Ежедневно, круглосуточно",
  maxChannel: "https://max.ru/patronage_family_chat",
  telegram: "https://t.me/patronage_care",
  vk: "https://vk.com/patronage_care",
  ok: "https://ok.ru/patronage.care",
  inn: "7712345678",
  ogrn: "1157746123456",
  license: "ЛО-77-01-012345 от 01.03.2023",
  payments: ["МИР", "Visa", "Mastercard", "СБП"],
} as const;

export const navLinks = [
  { href: "/about", label: "О нас" },
  { href: "/sidelki", label: "Услуга сиделки" },
  { href: "/pansionat", label: "Пансионат" },
  { href: "/social", label: "Социальная программа" },
  { href: "/transport", label: "Перевозка" },
  { href: "/#reviews", label: "Отзывы" },
] as const;

/** Быстрые ссылки в подвале: Услуги, Отзывы, Прайс, Документы */
export const quickLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#pricing", label: "Прайс" },
  { href: "/#documents", label: "Документы" },
] as const;
