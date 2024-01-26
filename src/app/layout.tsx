import type { Metadata } from "next";

import { ClerkProvider } from '@clerk/nextjs'

import localFont from "next/font/local";
import Image from "next/image";

import "./globals.css";
import styles from "@/styles/Layout.module.css";

import Nav from "@/components/Nav/Nav";
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  title: "Harc Wesnothért",
  description: "Magyar Wesnoth Közösségi Portál",
  icons: {
    icon: '/favicon.ico',
  }
};

const ebg = localFont({
  src: "./font/ebg.ttf",
  display: "swap",
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={ebg.className}>
        <main className={styles.main}>
          
          <header>
            <div className={styles.fejlec}>
              <div className={styles.logo}>
                <Image
                  src="/logo-hu.png"
                  alt="Hungarian Wesnoth Logo"
                  width={415}
                  height={210}
                  priority
                  className={styles.logoImg}
                  />
              </div>
            </div>
          </header>

          <nav>
              <Nav />
          </nav>

          <div className={styles.tartkozep}>
            <aside>
              <div className={styles.sideProfile}>Side</div>
            </aside>

            <section>
              <div className={styles.kozep}>{children}</div>
            </section>
          </div>

          <footer>
            <div className={styles.lablec}>
              <Footer />
            </div>
          </footer>

        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
