import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import ScrollRestoration from "@/components/ScrollRestoration";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Пансионат «Патронаж» — забота и поддержка близких",
    template: "%s — Пансионат «Патронаж»",
  },
  description:
    "Пансионат для пожилых людей и людей с ограниченной мобильностью: круглосуточный уход, комфортные условия и внимательное отношение к каждому.",
};

/**
 * Выполняется до гидратации React: отключает штатное восстановление
 * скролла браузером (из-за scroll-behavior: smooth оно «улетает» вниз)
 * и мгновенно возвращает сохранённую позицию текущей страницы.
 */
const SCROLL_RESTORE_SCRIPT = `(function(){try{
if('scrollRestoration' in history){history.scrollRestoration='manual';}
var y=+sessionStorage.getItem('patronage:scroll:'+location.pathname);
if(y>0){requestAnimationFrame(function(){window.scrollTo({top:y,behavior:'instant'});});}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_SCRIPT }} />
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}
