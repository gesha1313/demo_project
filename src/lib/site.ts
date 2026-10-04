export const site = {
  name: "Патронаж",
  tagline: "Забота и поддержка",
  phone: "+7 (000) 000-00-00",
  phoneHref: "tel:+70000000000",
  email: "example@mail.ru",
} as const;

export const navLinks = [
  { href: "/about", label: "О пансионате" },
  { href: "/services", label: "Услуги и условия" },
  { href: "/#contacts", label: "Контакты" },
] as const;
