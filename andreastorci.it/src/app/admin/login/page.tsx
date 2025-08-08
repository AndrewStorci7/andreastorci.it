import LoginForm from './form/LoginForm';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from "react";
import { 
    AuthProvider, 
    PageSelectorProvider 
} from '@providers';

import "./login.css"

export const Login: NextPage = () => {

    return (
        <PageSelectorProvider>
            <AuthProvider>
                <Head>
                    <title>Login | Admin Panel</title>
                    <meta name="description" content="Login page" />
                </Head>
                
                <div className="full-h full-w flex center text-center">
                    <div className="w-full text-center login-container">
                        <div className="">
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                Accedi al pannello
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Oppure{' '}
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    registrati
                                </a>
                            </p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </AuthProvider>
        </PageSelectorProvider>
    )
}

export default Login