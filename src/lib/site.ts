export const site = {
  name: "Патронаж",
  tagline: "Забота и поддержка",
  phone: "+7 (999) 139-39-04",
  phoneHref: "tel:+79991393904",
  email: "sarkana999@gmail.com",
  address: "г. Москва, ул. Тихая, 12",
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
  { href: "/register", label: "Заявка в пансионат" },
  { href: "/about", label: "О пансионате" },
  { href: "/services", label: "Услуги и условия" },
  { href: "/#contacts", label: "Контакты" },
] as const;

/** Быстрые ссылки в подвале: Услуги, Отзывы, Прайс, Документы */
export const quickLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#reviews", label: "Отзывы" },
  { href: "/#pricing", label: "Прайс" },
  { href: "/#documents", label: "Документы" },
] as const;
