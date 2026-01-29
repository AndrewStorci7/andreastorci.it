'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@providers'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { User } from '@ctypes'

interface FormData {
    username: string
    password: string
}

const LoginForm = () => {

    const { setUser, error, setError } = useAuth();
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    })
    // const [errorInner, setErrorInner] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
            setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const req = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const res = await req.json();
            
            if (res.success) {
                Cookies.set("page", JSON.stringify({ 
                    page: "home", 
                    title: "Homepage" 
                }), {
                    expires: 7,
                    sameSite: 'strict'
                })
                
                setUser(res.user)
                router.push('/admin')
            } else {
                setError(res.error)
            }
        } catch {
            setError('Credenziali non valide. Riprova.')
        } finally {
            setIsLoading(false)
        }
    }

    const [checked, setCheck] = useState<boolean>(false)

    return (
        <form className="text-center space-y-4" onSubmit={handleSubmit}>
            {(error) && (
                <div style={{
                    width: "300px",
                    // border: "1px solid #3D3D3D",
                    borderRadius: "10px",
                    padding: "10px",
                    marginBottom: "10px",
                    backgroundColor: "rgba(252, 93, 93, 0.6)",
                    boxShadow: "0 0 15px rgba(252, 93, 93, 0.4), inset 0 0 10px rgba(252, 93, 93, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <div>
                        <h3>Errore nell'autenticazione</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            {/* {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                    </div>
                </div>
            )} */}
            
            <div className="text-center space-y-2">
                <div className='space-x-2'>
                    <label htmlFor="username" className="sr-only">username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className='space-x-2'>
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="flex items-center justify-around center">
                <div className="flex items-center checkbox-wrapper">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className={`custom-check ${checked ? "checked" : ""}`} onClick={() => setCheck(prev => !prev)}></span>
                    <label htmlFor="remember-me" className="block text-sm">Ricordami</label>
                </div>

                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Password dimenticata?</a>
                </div>
            </div>

            <div className='flex center'>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed login-button"
                >
                    {isLoading ? (
                        <span>Caricamento...</span>
                    ) : (
                        <>
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg
                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            </span>
                            Accedi
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default LoginForm