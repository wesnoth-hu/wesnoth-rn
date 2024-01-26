'use client'

import { useSignUp } from "@clerk/nextjs";
 
import React, { ChangeEvent, useState} from 'react';
import Image from 'next/image';

import styles from '@/styles/Auth.module.css';

import { signUpZodSchema } from '@/lib/signUpZodSchema';
import { signUpType } from '@/lib/signUpType';
import { ValidationError } from '@/lib/ZodError';
import { handleZodValidation } from '@/lib/ZodError';

type InputChangeEvent =
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>;

const SignUp: React.FC = () => {

    const { isLoaded, signUp } = useSignUp();

    const [signUpData, setSignUpData] = useState<signUpType>({
        username: "",
        email: "",
        password: "",
        confirm: "",
        race: "bat",
    });

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setSignUpData({
            username: "",
            email: "",
            password: "",
            confirm: "",
            race: "bat",
        })
    };

    const onClickSubmit = async (data: signUpType) => {
        if (!isLoaded) {
            return;
        };

        try {
            // 'data' does not exist on type Partial...etc.
            await signUp.create({
                data.email,
                data.password
            });
        } catch (error) {
            console.log(error)
        }
    };

    const [errors, setErrors] = useState<ValidationError<typeof signUpZodSchema>>({});

    const schemaParse = (data: signUpType) => {
        handleZodValidation({
            onError: setErrors,
            data: data,
            onSuccess: async () => {
                setErrors({});
                onClickSubmit(data);
                resetForm();
            },
            schema: signUpZodSchema,
        });
    };

    return (
        <>
            <main className={styles.main}>
                <div className={styles.form}>
                    {/* Labels */}
                    <div className={styles.labels}>
                        <label htmlFor="username" >Felhasználónév:</label>
                        <label htmlFor="email" >Email:</label>
                        <label htmlFor="password" >Jelszó:</label>
                        <label htmlFor="confirm" >Jelszó ismét:</label>
                        <label htmlFor="race" >Válassz fajt:</label>
                    </div>

                    {/* Inputs */}
                    <div className={styles.inputs}>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={signUpData.username}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="Gipsz Jakab"
                        />

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={signUpData.email}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="gipszjakab@gmail.com"
                        />

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={signUpData.password}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="********"
                        />

                        <input
                            type="password"
                            id="confirm"
                            name="confirm"
                            value={signUpData.confirm}
                            onChange={(e) => handleInputChange(e)}
                            autoComplete='on'
                            placeholder="********"
                        />

                        <select id="race" name="race" value={signUpData.race} onChange={(e) => { handleInputChange(e) }}>
                            <option value="bat" >Denevérek</option>
                            <option value="dunefolk" >Dűnék-népe</option>
                            <option value="human" >Emberek</option>
                            <option value="undead" >Élőholtak</option>
                            <option value="wose" >Fapásztorok</option>
                            <option value="wolf" >Farkasok</option>
                            <option value="gryphon">Griffek</option>
                            <option value="saurian" >Gyíkok</option>
                            <option value="goblin" >Koboldok</option>
                            <option value="horse" >Lovak</option>
                            <option value="mechanical" >Mechanikus</option>
                            <option value="naga" >Nagák</option>
                            <option value="ogre" >Ogrék</option>
                            <option value="orc" >Orkok</option>
                            <option value="drake" >Perzsekények</option>
                            <option value="merfolk" >Sellők</option>
                            <option value="falcon" >Sólymok</option>
                            <option value="monster" >Szörnyek</option>
                            <option value="dwarf" >Törpök</option>
                            <option value="troll" >Trollok</option>
                            <option value="elf" >Tündék</option>
                        </select>
                        <div className={styles.race}>
                            <Image
                                src={`/race/${signUpData.race}.png`}
                                alt={`${signUpData.race}-icon`}
                                width={72}
                                height={72}
                                priority
                            />
                        </div>
                        <button type="submit" id={styles.register} onClick={() => { schemaParse(signUpData) }}>Regisztrálok</button>
                    </div>
                </div>
                    <div className={styles.error}>
                        {errors && errors.username && <div style={{ color: "red" }}>Felhasználónév - {errors.username}</div>}
                        {errors && errors.email && <div style={{ color: "red" }}>Email - {errors.email}</div>}
                        {errors && errors.password && <div style={{ color: "red" }}>Jelszó - {errors.password}</div>}
                        {errors && errors.confirm && <div style={{ color: "red" }}>Jelszó ismét - {errors.confirm}</div>}
                    </div>
            </main>
        </>
    )
};

export default SignUp;