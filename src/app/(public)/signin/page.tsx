'use client'

import userLoginDB from "@/components/userLogin/userLoginDB";
import GetCookie from "@/lib/login/getCookie";
import GetUserID from "@/lib/login/getuserID";
import useAuthStore from "@/lib/zustand/authState";

import type { loginType } from "@/lib/login/loginType";
import { loginZodSchema } from '@/lib/login/loginZodSchema';
import { ValidationError } from '@/lib/ZodError';
import { handleZodValidation } from '@/lib/ZodError';

import React, { ChangeEvent, useState } from 'react';
import { useRouter } from "next/navigation";

import styles from '@/styles/Login.module.css';

export default function Page() {

    const { login } = useAuthStore();

    const router = useRouter();

    const [loginData, setLoginData] = useState<loginType>({
        email: "",
        password: "",
        confirm: ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setLoginData({
            email: "",
            password: "",
            confirm: ""
        });
    };

    const [errors, setErrors] = useState<ValidationError<typeof loginZodSchema>>({});

    const onClickLogin = async (logindata: loginType) => {
        try {
            await userLoginDB(logindata);
            resetForm();
            router.push('/account');
        } catch (error) {
            console.log(error);
        }
    };

    const schemaParse = (data: loginType) => {
        handleZodValidation({
            onError: setErrors,
            data: data,
            onSuccess: async () => {
                setErrors({});
                onClickLogin(data);
                resetForm();
            },
            schema: loginZodSchema,
        });
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.form}>
                    {/* Labels */}
                    <div className={styles.labels}>
                        <label htmlFor="email" >Email:</label>
                        <label htmlFor="password" >Jelszó:</label>
                        <label htmlFor="confirm" >Jelszó ismét:</label>
                    </div>

                    {/* Inputs */}
                    <div className={styles.inputs}>
                        
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="gipszjakab@gmail.com"
                        />

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={loginData.password}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="********"
                        />

                        <input
                            type="password"
                            id="confirm"
                            name="confirm"
                            value={loginData.confirm}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="********"
                        />
                        <button type="submit" id={styles.register} onClick={() => { schemaParse(loginData) }}>Bejelentkezek</button>
                    </div>
                </div>
                    <div className={styles.error}>
                        {errors && errors.email && <div style={{ color: "red" }}>Email - {errors.email}</div>}
                        {errors && errors.password && <div style={{ color: "red" }}>Jelszó - {errors.password}</div>}
                        {errors && errors.confirm && <div style={{ color: "red" }}>Jelszó ismét - {errors.confirm}</div>}
                    </div>
            </main>
        </>
    )
}