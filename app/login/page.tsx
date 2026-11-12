'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { setUsuario } from '@/app/lib/auth';

//=============================

// Mudanças

import { CustomAcessibilidade } from "@/componentes/CustomAcessibilidade/CustomAcessibilidade";
import { CustomAcessoRapido } from "@/componentes/CustomAcessoRapido/CustomAcessoRapido";
import { CustomCarrossel } from "@/componentes/CustomCarrossel/CustomCarrossel";
import { CustomChamadaProjeto } from "@/componentes/CustomChamadaProjeto/CustomChamadaProjeto";
import { CustomFooter } from "@/componentes/CustomFooter/CustomFooter";
import { CustomHeader } from "@/componentes/CustomHeader/CustomHeader";
import { CustomNavBar } from "@/componentes/CustomNavBar/CustomNavBar";
import { CustomNoticias } from "@/componentes/CustomNoticias/CustomNoticias";


//==============================



export default function LoginPage() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
      const resposta = await fetch(`${api}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao fazer login');
        return;
      }

      setUsuario(dados);
      router.push('/Admin');

    } catch {
      setErro('Não foi possível conectar ao servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {/* <!-- Icones Acessibilidade --> */}
      < CustomAcessibilidade />

      {/* <!-- Cabeçalho Principal - Header --> */}
      < CustomHeader />

      {/* <!-- Navegação --> */}
      < CustomNavBar isMenuOpen={menuAberto} onOpenMenu={() => setMenuAberto(true)
      } />


      <main className={styles.container}>

        <div className={styles.card}>
          <h2 className={styles.titulo}>
            LOGIN DE USUÁRIO
            <span className="material-symbols-rounded">pets</span>
          </h2>
          <p className={styles.subtitulo}>Insira seus dados para continuar:</p>

          <form onSubmit={handleSubmit}>
            <div className={styles['form-group']}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Crie uma senha segura..."
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>

            {erro && <p className={styles.erro}>{erro}</p>}

            <button type="submit" className={styles['btn-entrar']} disabled={carregando}>
              {carregando ? 'ENTRANDO...' : 'ENTRAR'}
              <span className="material-symbols-rounded">arrow_forward</span>
            </button>
          </form>

          <a href="/recuperar-senha" className={styles['link-esqueci']}>
            ESQUECI MINHA SENHA
          </a>
        </div>

      </main>
      {/* <!-- Rodapé --> */}
      <CustomFooter />
    </>
  );
}