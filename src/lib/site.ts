export const site = {
  name: "Патронаж",
  tagline: "Забота и поддержка",
  phone: "+7 (999) 139-39-04",
  phoneHref: "tel:+79991393904",
  email: "sarkana999@gmail.com",
} as const;

export const navLinks = [
  { href: "/caretaker", label: "Услуга сиделки" },
  { href: "/about", label: "О пансионате" },
  { href: "/services", label: "Услуги и условия" },
  { href: "/#contacts", label: "Контакты" },
] as const;
