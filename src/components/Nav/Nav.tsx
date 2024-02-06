'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import useAuthStore from '@/lib/zustand/authState';
import DeleteCookieSession from '@/lib/logout/deleteCookieSession';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUser,
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faUserPlus,
    faNewspaper,
    faMonument,
    faTrophy,
    faTableList,
    faBars
} from '@fortawesome/free-solid-svg-icons'

import styles from '@/styles/Nav.module.css';


export default function Nav() {

    const { isAuthenticated, userID } = useAuthStore();
    const handleLogout = useAuthStore((state) => state.logout);

    const [isOpen, setIsOpen] = useState(false);

    const handleMenuToggle = (event: any) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    // dropdown menu reference
    const dropdownRef995 = useRef<HTMLDivElement>(null);
    const dropdownRef650 = useRef<HTMLDivElement>(null);

    // state to store Menu icon Top and Left coordinates
    const [menuTopLeft, setMenuTopLeft] = useState<{ screenY: number, screenX: number }>({ screenY: 0, screenX: 0 });

    // state to define `window` object
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    // useeffect to auto-close dropdown menu at specific width
    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined') {
                setWindowWidth(window.innerWidth);
            }
        };

        window.addEventListener('resize', handleResize);

        if (typeof window !== 'undefined' && windowWidth > 995) {
            setIsOpen(false);
        };

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowWidth]);

    // useEffect to return Menu icon's coordinates for dropdown menu rendering
    useEffect(() => {
        // define menuIcon div element for 650 and 980 pixels
        const menuIcon995 = document.getElementById("menuRoot995");
        const menuIcon650 = document.getElementById("menuRoot650");

        // existence check
        if (!(menuIcon995 || menuIcon650)) {
            return;
        }

        // put dropdown menu to calculated coordinates between 650 and 980 pixels
        const iconRect995 = menuIcon995?.getBoundingClientRect();
        const iconLeft995 = iconRect995?.left! + window.scrollX + 175;
        const newTop995 = iconRect995?.bottom! + window.scrollY + 10;
        setMenuTopLeft({ screenY: newTop995, screenX: iconLeft995 });

        // put dropdown menu to claculated coordinates for 650 and lower pixels
        const iconRect650 = menuIcon650?.getBoundingClientRect();
        const iconLeft650 = iconRect650?.left! + window.scrollX + 175;
        const newTop650 = iconRect650?.bottom! + window.scrollY + 10;
        setMenuTopLeft({ screenY: newTop650, screenX: iconLeft650 });

        // move dropdown menu on resize between 650 and 980 pixels
        const handleResize995 = () => {
            const iconRect = menuIcon995?.getBoundingClientRect();
            const iconleft = iconRect?.right! - window.scrollX - 175;
            const newTop = iconRect?.bottom! + window.scrollY + 10;
            setMenuTopLeft({ screenY: newTop, screenX: iconleft });
        }

        // move dropdown menu on resize between for 650 and lower pixels
        const handleResize650 = () => {
            const iconRect = menuIcon650?.getBoundingClientRect();
            const iconleft = iconRect?.right! - window.scrollX - 175;
            const newTop = iconRect?.bottom! + window.scrollY + 10;
            setMenuTopLeft({ screenY: newTop, screenX: iconleft });
        }

        if (windowWidth >= 650) {
            handleResize995();
            window.addEventListener("resize", handleResize995);
        }

        if (windowWidth < 650) {
            handleResize650();
            window.addEventListener("resize", handleResize650);
        }

        return () => {
            window.removeEventListener("resize", handleResize995);
            window.removeEventListener("resize", handleResize650);
        }

    }, [windowWidth]);

    // auto-close dorpdown menu if clicks are outside of dropdown menu context
    const handleClickOutside = (event: any) => {
        if ((dropdownRef995.current && !dropdownRef995.current.contains(event.target)) || (dropdownRef650 && !dropdownRef650.current?.contains(event.target))) {
            setIsOpen(false);
        }
    };

    // call auto-close function for dropdown menu with useEffect
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div className={styles.nav}>
                {isAuthenticated && <>
                    <div className={styles.navitem} onClick={() => { setIsOpen(false) }}>
                        <Link href="/account" className={styles.link} ><FontAwesomeIcon icon={faUser} size="sm" /> Adatlap</Link>
                    </div>
                    <div className={styles.navitem} onClick={() => { setIsOpen(false); DeleteCookieSession(userID); handleLogout() }}>
                        <Link href="/" className={styles.link}><FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" /> Kilépés</Link>
                    </div>
                </>}
                {!isAuthenticated && <>
                    <div className={styles.navitem}>
                        <Link href="/signin" className={styles.link}><FontAwesomeIcon icon={faArrowRightToBracket} size="sm" /> Bejelentkezés</Link>
                    </div>
                    <div className={styles.navitem}>
                        <Link href="/signup" className={styles.link}><FontAwesomeIcon icon={faUserPlus} size="sm" /> Regisztráció</Link>
                    </div>
                </>}
                <div className={styles.navitem}>
                    <Link href="/" className={styles.link}><FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek</Link>
                </div>
                <div className={styles.navitem}>
                    <Link href="#" className={styles.link}><FontAwesomeIcon icon={faMonument} size="sm" /> Történelem</Link>
                </div>
                <div className={styles.navitem}>
                    <Link href="#" className={styles.link}><FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság</Link>
                </div>
                <div className={styles.navitem}>
                    <Link href="#" className={styles.link}><FontAwesomeIcon icon={faTableList} size="sm" /> Fórum</Link>
                </div>
            </div>

            <div className={styles.shrunk995}>
                {isAuthenticated && <>
                    <div className={styles.navitem} onClick={() => { setIsOpen(false) }}>
                        <Link href="#" className={styles.link} ><FontAwesomeIcon icon={faUser} size="sm" /> Adatlap</Link>
                    </div>
                    <div className={styles.navitem} onClick={() => { setIsOpen(false); DeleteCookieSession(userID); handleLogout() }}>
                        <Link href="#" className={styles.link}><FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" /> Kilépés</Link>
                    </div>
                </>}
                {!isAuthenticated && <>
                    <div className={styles.navitem}>
                        <Link href="/signin" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faArrowRightToBracket} size="sm" /> Bejelentkezés</Link>
                    </div>
                    <div className={styles.navitem}>
                        <Link href="/signup" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faUserPlus} size="sm" /> Regisztráció</Link>
                    </div>
                </>}
                <div className={styles.navitem}>
                    <Link href="/" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek</Link>
                </div>
                <div id="menuRoot995" className={styles.menu995} onClick={handleMenuToggle}><FontAwesomeIcon icon={faBars} size="sm" /> Menü</div>
            </div>

            {windowWidth > 650 && windowWidth < 995 && isOpen && <>
                <div style={{ position: 'absolute', top: `${menuTopLeft.screenY}px`, left: `${menuTopLeft.screenX}px`, zIndex: 1 }} ref={dropdownRef995}>
                    <div className={styles.hamburgerMenu}>
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faMonument} size="sm" /> Történelem</Link>
                        </div>
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság</Link>
                        </div>
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faTableList} size="sm" /> Fórum</Link>
                        </div>
                    </div>
                </div>
            </>}

            <div className={styles.shrunk650}>
                <div className={styles.navitem}>
                    <Link href="/" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faNewspaper} size="sm" /> Hírek</Link>
                </div>
                <div id="menuRoot650" className={styles.menu650} onClick={handleMenuToggle}><FontAwesomeIcon icon={faBars} size="sm" /> Menü</div>
            </div>

            {windowWidth < 650 && isOpen && <>
                <div style={{ position: 'absolute', top: `${menuTopLeft.screenY}px`, left: `${menuTopLeft.screenX}px`, zIndex: 1 }} ref={dropdownRef650}>
                    <div className={styles.hamburgerMenu}>
                        {isAuthenticated && <>
                            <div className={styles.navitem} onClick={() => { setIsOpen(false) }}>
                                <Link href="#" className={styles.link} ><FontAwesomeIcon icon={faUser} size="sm" /> Adatlap</Link>
                            </div>
                            <div className={styles.navitem} onClick={() => { setIsOpen(false); DeleteCookieSession(userID); handleLogout() }}>
                                <Link href="#" className={styles.link}><FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" /> Kilépés</Link>
                            </div>
                        </>}
                        {!isAuthenticated && <>
                            <div className={styles.navitem}>
                                <Link href="/signin" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faArrowRightToBracket} size="sm" /> Bejelentkezés</Link>
                            </div>
                            <div className={styles.navitem}>
                                <Link href="/signup" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faUserPlus} size="sm" /> Regisztráció</Link>
                            </div>
                        </>}
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faMonument} size="sm" /> Történelem</Link>
                        </div>
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faTrophy} size="sm" /> Bajnokság</Link>
                        </div>
                        <div className={styles.navitem}>
                            <Link href="#" className={styles.link} onClick={() => { setIsOpen(false) }}><FontAwesomeIcon icon={faTableList} size="sm" /> Fórum</Link>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}