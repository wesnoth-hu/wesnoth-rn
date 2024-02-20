"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthContext } from "@/context/AuthContextProvider/AuthContext";
import { SessionContext } from "@/context/SessionContextProvider/SessionContext";

import UpdateSession from "@/lib/logout/updateSession";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faUserPlus,
  faNewspaper,
  faMonument,
  faTrophy,
  faTableList,
  faBars,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

import styles from "@/styles/Menu.module.css";
import SessionData from "../Server/sessionData";

export default function Menu() {
  const [isAuth, setIsAuth] = useContext(AuthContext);
  const [session, setSession] = useContext(SessionContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unseal, setUnseal] = useState<{
    userID: string;
    email: string;
    userIP: string;
    randomNano: string;
  }>({
    userID: "",
    email: "",
    userIP: "",
    randomNano: "",
  });

  const router = useRouter();

  const handleMenuToggle = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  // dropdown menu reference
  const dropdownRef1150 = useRef<HTMLDivElement>(null);
  const dropdownRef650 = useRef<HTMLDivElement>(null);

  // state to store Menu icon Top and Left coordinates
  const [menuTopLeft, setMenuTopLeft] = useState<{
    screenY: number;
    screenX: number;
  }>({ screenY: 0, screenX: 0 });

  // state to define `window` object
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    async function fetchData() {
      const unsealed = await SessionData();

      setUnseal((prevSeal) => ({
        ...prevSeal,
        userID: unsealed.userID,
        email: unsealed.email,
        userIP: unsealed.userIP,
        randomNano: unsealed.randomNano,
      }));
    }
    if (session !== "" && isAuth === true) {
      fetchData();
    }
  }, [isAuth, session]);

  // useeffect to auto-close dropdown menu at specific width
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setWindowWidth(window.innerWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    if (typeof window !== "undefined" && windowWidth > 1150) {
      setIsOpen(false);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  // useEffect to return Menu icon's coordinates for dropdown menu rendering
  useEffect(() => {
    // define menuIcon div element for 650 and 980 pixels
    const menuIcon1150 = document.getElementById("menuRoot1150");
    const menuIcon650 = document.getElementById("menuRoot650");

    // existence check
    if (!(menuIcon1150 || menuIcon650)) {
      return;
    }

    // put dropdown menu to calculated coordinates between 650 and 980 pixels
    const iconRect1150 = menuIcon1150!.getBoundingClientRect();
    const iconLeft1150 = iconRect1150.left! + window.scrollX + 175;
    const newTop1150 = iconRect1150.bottom! + window.scrollY + 10;
    setMenuTopLeft({ screenY: newTop1150, screenX: iconLeft1150 });

    // put dropdown menu to claculated coordinates for 650 and lower pixels
    const iconRect650 = menuIcon650!.getBoundingClientRect();
    const iconLeft650 = iconRect650.left! + window.scrollX + 175;
    const newTop650 = iconRect650.bottom! + window.scrollY + 10;
    setMenuTopLeft({ screenY: newTop650, screenX: iconLeft650 });

    // move dropdown menu on resize between 650 and 980 pixels
    const handleResize1150 = () => {
      const iconRect = menuIcon1150!.getBoundingClientRect();
      const iconleft = iconRect.right! - window.scrollX - 175;
      const newTop = iconRect.bottom! + window.scrollY + 10;
      setMenuTopLeft({ screenY: newTop, screenX: iconleft });
    };

    // move dropdown menu on resize between for 650 and lower pixels
    const handleResize650 = () => {
      const iconRect = menuIcon650!.getBoundingClientRect();
      const iconleft = iconRect.right! - window.scrollX - 175;
      const newTop = iconRect.bottom! + window.scrollY + 10;
      setMenuTopLeft({ screenY: newTop, screenX: iconleft });
    };

    if (windowWidth >= 650) {
      handleResize1150();
      window.addEventListener("resize", handleResize1150);
    }

    if (windowWidth < 650) {
      handleResize650();
      window.addEventListener("resize", handleResize650);
    }

    return () => {
      window.removeEventListener("resize", handleResize1150);
      window.removeEventListener("resize", handleResize650);
    };
  }, [windowWidth]);

  // auto-close dorpdown menu if clicks are outside of dropdown menu context
  const handleClickOutside: EventListenerOrEventListenerObject = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (
      (dropdownRef1150.current &&
        !dropdownRef1150.current.contains(event.target as Node)) ||
      (dropdownRef650 &&
        !dropdownRef650.current?.contains(event.target as Node))
    ) {
      setIsOpen(false);
    }
  };

  // call auto-close function for dropdown menu with useEffect
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.nav}>
        {isAuth && (
          <>
            <div
              className={styles.navitem}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Link href={`/account/${unseal.userID}`} className={styles.link}>
                <FontAwesomeIcon icon={faUser} size="sm" /> Adatlap
              </Link>
            </div>
            <div
              className={styles.navitem}
              onClick={async () => {
                setIsOpen(false);
                await UpdateSession(unseal.userID);
                setIsAuth(false);
                setSession("");
                setUnseal({
                  userID: "",
                  email: "",
                  userIP: "",
                  randomNano: "",
                });
                router.push("/");
              }}
            >
              <Link href="/" className={styles.link}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" />{" "}
                Kilépés
              </Link>
            </div>
          </>
        )}
        {!isAuth && (
          <>
            <div className={styles.navitem}>
              <Link href="/signin" className={styles.link}>
                <FontAwesomeIcon icon={faArrowRightToBracket} size="sm" />{" "}
                Bejelentkezés
              </Link>
            </div>
            <div className={styles.navitem}>
              <Link href="/signup" className={styles.link}>
                <FontAwesomeIcon icon={faUserPlus} size="sm" /> Regisztráció
              </Link>
            </div>
          </>
        )}
        <div className={styles.navitem}>
          <Link href="/" className={styles.link}>
            <FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek
          </Link>
        </div>
        <div className={styles.navitem}>
          <Link href="#" className={styles.link}>
            <FontAwesomeIcon icon={faMonument} size="sm" /> Történelem
          </Link>
        </div>
        <div className={styles.navitem}>
          <Link href="#" className={styles.link}>
            <FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság
          </Link>
        </div>
        <div className={styles.navitem}>
          <Link href="#" className={styles.link}>
            <FontAwesomeIcon icon={faTableList} size="sm" /> Fórum
          </Link>
        </div>
        <div className={styles.navitem}>
          <Link href="#" className={styles.link}>
            <FontAwesomeIcon icon={faCircleQuestion} size="sm" /> Súgó
          </Link>
        </div>
      </div>

      <div className={styles.shrunk1150}>
        {isAuth && (
          <>
            <div
              className={styles.navitem}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Link href={`/account/${unseal.userID}`} className={styles.link}>
                <FontAwesomeIcon icon={faUser} size="sm" /> Adatlap
              </Link>
            </div>
            <div
              className={styles.navitem}
              onClick={async () => {
                setIsOpen(false);
                await UpdateSession(unseal.userID);
                setIsAuth(false);
                setSession("");
                setUnseal({
                  userID: "",
                  email: "",
                  userIP: "",
                  randomNano: "",
                });
                router.push("/");
              }}
            >
              <Link href="/" className={styles.link}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" />{" "}
                Kilépés
              </Link>
            </div>
          </>
        )}
        {!isAuth && (
          <>
            <div className={styles.navitem}>
              <Link
                href="/signin"
                className={styles.link}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faArrowRightToBracket} size="sm" />{" "}
                Bejelentkezés
              </Link>
            </div>
            <div className={styles.navitem}>
              <Link
                href="/signup"
                className={styles.link}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faUserPlus} size="sm" /> Regisztráció
              </Link>
            </div>
          </>
        )}
        <div className={styles.navitem}>
          <Link
            href="/"
            className={styles.link}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek
          </Link>
        </div>
        <div
          id="menuRoot1150"
          className={styles.menu1150}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faBars} size="sm" /> Menü
        </div>
      </div>

      {windowWidth > 650 && windowWidth < 1150 && isOpen && (
        <>
          <div
            style={{
              position: "absolute",
              top: `${menuTopLeft.screenY}px`,
              left: `${menuTopLeft.screenX}px`,
              zIndex: 1,
            }}
            ref={dropdownRef1150}
          >
            <div className={styles.hamburgerMenu}>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faMonument} size="sm" /> Történelem
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTableList} size="sm" /> Fórum
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" /> Súgó
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={styles.shrunk650}>
        <div className={styles.navitem}>
          <Link
            href="/"
            className={styles.link}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek
          </Link>
        </div>
        <div
          id="menuRoot650"
          className={styles.menu650}
          onClick={handleMenuToggle}
        >
          <FontAwesomeIcon icon={faBars} size="sm" /> Menü
        </div>
      </div>

      {windowWidth < 650 && isOpen && (
        <>
          <div
            style={{
              position: "absolute",
              top: `${menuTopLeft.screenY}px`,
              left: `${menuTopLeft.screenX}px`,
              zIndex: 1,
            }}
            ref={dropdownRef650}
          >
            <div className={styles.hamburgerMenu}>
              {isAuth && (
                <>
                  <div
                    className={styles.navitem}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Link
                      href={`/account/${unseal.userID}`}
                      className={styles.link}
                    >
                      <FontAwesomeIcon icon={faUser} size="sm" /> Adatlap
                    </Link>
                  </div>
                  <div
                    className={styles.navitem}
                    onClick={async () => {
                      setIsOpen(false);
                      await UpdateSession(unseal.userID);
                      setIsAuth(false);
                      setSession("");
                      setUnseal({
                        userID: "",
                        email: "",
                        userIP: "",
                        randomNano: "",
                      });
                      router.push("/");
                    }}
                  >
                    <Link href="/" className={styles.link}>
                      <FontAwesomeIcon
                        icon={faArrowRightFromBracket}
                        size="sm"
                      />{" "}
                      Kilépés
                    </Link>
                  </div>
                </>
              )}
              {!isAuth && (
                <>
                  <div className={styles.navitem}>
                    <Link
                      href="/signin"
                      className={styles.link}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowRightToBracket} size="sm" />{" "}
                      Bejelentkezés
                    </Link>
                  </div>
                  <div className={styles.navitem}>
                    <Link
                      href="/signup"
                      className={styles.link}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserPlus} size="sm" />{" "}
                      Regisztráció
                    </Link>
                  </div>
                </>
              )}
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faMonument} size="sm" /> Történelem
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faTableList} size="sm" /> Fórum
                </Link>
              </div>
              <div className={styles.navitem}>
                <Link
                  href="#"
                  className={styles.link}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} size="sm" /> Súgó
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
