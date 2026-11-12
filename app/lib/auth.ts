const CHAVE = 'usuario_logado';

export interface UsuarioLogado {
    id_usuario: number;
    nome: string;
    email: string;
    permissoes: { id_permissao: number; nome: string; descricao: string }[];
}

export function getUsuario(): UsuarioLogado | null {
    if (typeof window === 'undefined') return null;
    try {
        const dados = localStorage.getItem(CHAVE);
        return dados ? JSON.parse(dados) : null;
    } catch {
        return null;
    }
}

export function setUsuario(usuario: UsuarioLogado): void {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
}

export function logout(): void {
    localStorage.removeItem(CHAVE);
}

export function temPermissao(nomePermissao: string): boolean {
    const usuario = getUsuario();
    if (!usuario) return false;
    return usuario.permissoes.some(p => p.nome === nomePermissao);
}
