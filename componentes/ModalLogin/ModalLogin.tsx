'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setUsuario } from '@/app/lib/auth'

type Props = {
    aberto: boolean
    onFechar: () => void
}

export function ModalLogin({ aberto, onFechar }: Props) {
    const router = useRouter()
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [form, setForm] = useState({ email: '', senha: '' })

    // Fecha com Esc, bloqueia scroll e esconde VLibras quando aberto
    useEffect(() => {
        if (!aberto) return
        const onTecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
        document.addEventListener('keydown', onTecla)
        document.body.style.overflow = 'hidden'
        document.body.classList.add('modal-login-aberto')
        return () => {
            document.removeEventListener('keydown', onTecla)
            document.body.style.overflow = ''
            document.body.classList.remove('modal-login-aberto')
        }
    }, [aberto, onFechar])

    // Limpa o form ao fechar
    useEffect(() => {
        if (!aberto) {
            setForm({ email: '', senha: '' })
            setErro('')
        }
    }, [aberto])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErro('')
        setCarregando(true)
        try {
            const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010'
            const res = await fetch(`${api}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const dados = await res.json()
            if (!res.ok) { setErro(dados.erro || 'Erro ao fazer login'); return }
            setUsuario(dados)
            onFechar()
            router.push('/Admin')
        } catch {
            setErro('Não foi possível conectar ao servidor')
        } finally {
            setCarregando(false)
        }
    }

    if (!aberto) return null

    return (
        <div className="ml-overlay" onClick={onFechar} role="dialog" aria-modal="true" aria-label="Login">
            <div className="ml-card" onClick={e => e.stopPropagation()}>
                <button className="ml-close" onClick={onFechar} aria-label="Fechar">
                    <span className="material-symbols-rounded">close</span>
                </button>

                <div className="ml-header">
                    <span className="material-symbols-rounded ml-header-icone">pets</span>
                    <h2 className="ml-titulo">Login</h2>
                </div>
                <p className="ml-subtitulo">Insira seus dados para continuar</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="ml-grupo">
                        <label htmlFor="ml-email">E-mail</label>
                        <input
                            id="ml-email"
                            type="email"
                            name="email"
                            placeholder="email@exemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="ml-grupo">
                        <label htmlFor="ml-senha">Senha</label>
                        <input
                            id="ml-senha"
                            type="password"
                            name="senha"
                            placeholder="Sua senha"
                            value={form.senha}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {erro && <p className="ml-erro">{erro}</p>}

                    <button type="submit" className="ml-btn-entrar" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                        {!carregando && <span className="material-symbols-rounded">arrow_forward</span>}
                    </button>
                </form>

                <a href="/recuperar-senha" className="ml-link-esqueci" onClick={onFechar}>
                    Esqueci minha senha
                </a>
            </div>
        </div>
    )
}
