import Link from 'next/link'

export const CustomFooter = () => {

    return (
        <footer className="rodape">
        <div className="rodape-topo">
            <div className="container py-4">
                <div className="rodape-grid">

                    <nav aria-label="Institucional">
                        <h2 className="titulo-rodape">Institucional</h2>
                        <ul className="lista-rodape">
                            <li><a href="/sobrenos" className="link-rodape">Quem Somos</a></li>
                            <li><a href="/quem-somos/noticias-e-eventos" className="link-rodape">Notícias e Eventos</a></li>
                            <li><a href="/quem-somos/seja-voluntario" className="link-rodape">Seja Voluntário</a></li>
                            <li><a href="/quem-somos/perguntas-frequentes" className="link-rodape">Perguntas Frequentes</a></li>
                        </ul>
                    </nav>

                    <nav aria-label="Transparência e Participação">
                        <h2 className="titulo-rodape">Transparência e Participação</h2>
                        <ul className="lista-rodape">
                            <li><a href="#" className="link-rodape">Legislação e Normas</a></li>
                            <li><a href="#" className="link-rodape">Relatórios e Indicadores</a></li>
                            <li><a href="#" className="link-rodape">Conselho Municipal de Bem-Estar Animal</a></li>
                            <li><a href="#" className="link-rodape">Parcerias e Termos de Cooperação</a></li>
                        </ul>
                    </nav>

                    <address className="rodape-contato">
                        <h2 className="titulo-rodape">Contato</h2>
                        <ul className="lista-rodape">
                            <li>
                                <span className="material-symbols-rounded">location_on</span>
                                Rua Do Canil, 388 - Vila Canil - Votorantim/SP
                            </li>
                            <li>
                                <span className="material-symbols-rounded">mail</span>
                                bemestaranimal@votorantim.sp.gov.br
                            </li>
                            <li>
                                <span className="material-symbols-rounded">phone</span>
                                (15) 3243-5612
                            </li>
                        </ul>
                    </address>

                    <div className="rodape-logos">
                        <Link href="/" className="logo-link" title="Ir para a página inicial">
                            <img src="/logo_Bem-EstarAnimal.png" alt="Departamento de Proteção e Bem-Estar Animal - página inicial" className="logo-departamento" />
                        </Link>
                        <a href="https://www.votorantim.sp.gov.br/" target="_blank" rel="noopener noreferrer" className="logo-link" title="Site da Prefeitura de Votorantim">
                            <img src="/logo_prefeituraVotorantim.png" alt="Prefeitura Municipal de Votorantim - abre o site da prefeitura" className="logo-prefeitura" />
                        </a>
                    </div>

                </div>
            </div>
        </div>
        <div className="rodape-base text-white">
            <div className="container py-3">
                <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">Nos siga nas redes sociais:</p>
                    <div className="d-flex gap-3">
                        <a href="#" className="icone-social-rodape" aria-label="Email">
                            <span className="material-symbols-rounded">mail</span>
                        </a>
                        <a href="#" className="icone-social-rodape" aria-label="WhatsApp">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                        </a>
                        <a href="#" className="icone-social-rodape" aria-label="Instagram">
                            <span className="material-symbols-rounded">photo_camera</span>
                        </a>
                        <a href="#" className="icone-social-rodape" aria-label="YouTube">
                            <span className="material-symbols-rounded">smart_display</span>
                        </a>
                        <a href="#" className="icone-social-rodape" aria-label="Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    )
}