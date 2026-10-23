import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PT_Serif } from "next/font/google";
import ScrollRestoration from "@/components/ScrollRestoration";
import FloatingActions from "@/components/FloatingActions";
import { getCurrentUser } from "@/lib/auth";
import ScrollProgress from "@/components/ScrollProgress";
import CookieBar from "@/components/CookieBar";
import "./globals.css";

const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-ptserif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Сиделки на дому и пансионат «Патронаж» — забота о близких",
    template: "%s — Патронаж",
  },
  description:
    "Проверенные сиделки и патронажные сёстры: уход за пожилыми на дому, медицинские процедуры, сопровождение и ежедневные отчёты семье. Пансионат для постоянного проживания.",
};

/**
 * Выполняется до гидратации React: отключает штатное восстановление
 * скролла браузером (из-за scroll-behavior: smooth оно «улетает» вниз)
 * и мгновенно возвращает сохранённую позицию текущей страницы.
 */
const SCROLL_RESTORE_SCRIPT = `(function(){try{
if('scrollRestoration' in history){history.scrollRestoration='manual';}
if(localStorage.getItem('patronage:hc')==='1'){document.documentElement.classList.add('hc');}
var y=+sessionStorage.getItem('patronage:scroll:'+location.pathname);
if(y>0){requestAnimationFrame(function(){window.scrollTo({top:y,behavior:'instant'});});}
}catch(e){}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Пользователь нужен FAB-кнопке чата: авторизованным — живой чат
  const user = await getCurrentUser();

  return (
    <html lang="ru" className={`${ptSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: SCROLL_RESTORE_SCRIPT }} />
        {children}
        <ScrollRestoration />
        <ScrollProgress />
        <FloatingActions myId={user?.id ?? null} />
        <CookieBar />
      </body>
    </html>
  );
}
