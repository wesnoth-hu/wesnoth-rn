import type { Metadata } from "next";

import localFont from "next/font/local";
import Image from "next/image";

import "./globals.css";
import styles from "@/styles/Layout.module.css";

import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Harc Wesnothért",
  description: "Magyar Wesnoth Közösségi Portál",
  icons: {
    icon: "/favicon.ico",
  },
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

              <nav>
                <Nav />
              </nav>
            </div>
          </header>

          <section>
            <div className={styles.tartkozep}>
              {/*Aside Left*/}
              <div className={styles.sideProfile}>Side</div>
              {/*Section*/}
              <div className={styles.kozep}>{children}</div>
            </div>
          </section>

          <footer>
            <div className={styles.lablec}>
              <Footer />
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}
