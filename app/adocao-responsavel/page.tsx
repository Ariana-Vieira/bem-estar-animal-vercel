import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { Acoes, Destaque, Itens, LinkBotao, Texto } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Adoção Responsável | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Adoção Responsável"
            patinhas
            resumo="Adotar, passear, passar uma noite com um aumigo ou oferecer um lar temporário: veja como se aproximar de um animal e por onde começar."
            secoes={[
                {
                    id: 'adocao',
                    titulo: 'Como adotar',
                    larga: true,
                    conteudo: (
                        <>
                            <Itens
                                itens={[
                                    {
                                        titulo: '1. Conheça',
                                        texto: 'Entenda como funciona a adoção responsável, o passeio e a Festa do Pijama nesta página.',
                                    },
                                    {
                                        titulo: '2. Faça o quiz',
                                        texto: 'Responda às perguntas com os mascotes Sol e Lua para encontrar o seu melhor amigo de primeira.',
                                    },
                                    {
                                        titulo: '3. Escolha seu pet',
                                        texto: 'Veja todos os animais do canil, com foto, características, porte, idade, comportamento e situação vacinal.',
                                    },
                                ]}
                            />
                            <Acoes>
                                <LinkBotao href="/filtro">Fazer o quiz</LinkBotao>
                                <LinkBotao href="/meetinpet">Ver animais para adoção</LinkBotao>
                            </Acoes>
                        </>
                    ),
                },
                {
                    titulo: 'Sobre a adoção responsável',
                    larga: true,
                    conteudo: (
                        <>
                            <Texto>
                                Dentro do projeto, o Departamento de Proteção e Bem-Estar Animal ganha uma plataforma
                                moderna para divulgar os cães e gatos disponíveis para adoção, com mais transparência
                                e eficiência.
                            </Texto>
                            <Texto>
                                A proposta é fortalecer a adoção responsável, aumentando a visibilidade dos animais e
                                aproximando o departamento da comunidade.
                            </Texto>
                        </>
                    ),
                },
                { titulo: 'Requisitos e documentos', dica: 'Informe quem pode adotar e os documentos exigidos.' },
                { titulo: 'Depois da adoção', dica: 'Reúna orientações de acompanhamento, vacinação e cuidados após adotar.' },
                {
                    id: 'passeio',
                    titulo: 'Passear com um Aumigo',
                    larga: true,
                    conteudo: (
                        <Destaque src="/fotopasseio.jpg" alt="Pessoa levando cachorro para passear">
                            <Texto>
                                O programa &quot;Passear com o Animal&quot; é voltado para quem deseja contribuir, mas
                                não pode adotar no momento. A iniciativa permite que qualquer pessoa cadastrada
                                realize caminhadas e passeios com os animais, oferecendo estímulo físico, socialização
                                e momentos de alegria para todos.
                            </Texto>
                        </Destaque>
                    ),
                },
                {
                    titulo: 'Como participar do passeio',
                    conteudo: (
                        <Texto>
                            Escolha um aumigo do canil, faça o seu cadastro e aguarde o contato da equipe para
                            combinar o passeio.
                        </Texto>
                    ),
                },
                { titulo: 'Regras e cuidados no passeio', dica: 'Liste as orientações de segurança e de conduta durante o passeio.' },
                {
                    id: 'festa-do-pijama',
                    titulo: 'Festa do Pijama com um Aumigo',
                    larga: true,
                    conteudo: (
                        <Destaque src="/festadopijama.avif" alt="Pessoa com aumigo assistindo filme">
                            <Texto>
                                A Festa do Pijama é uma ação especial que incentiva a adoção por meio da convivência.
                                A proposta é que a pessoa possa levar um animal para passar uma noite em seu lar,
                                vivendo um momento real de interação, carinho e companhia.
                            </Texto>
                            <Texto>
                                Com ajuda da plataforma, o departamento organiza e monitora essa atividade de forma
                                simples, ajudando você a escolher o companheiro ideal para a experiência.
                            </Texto>
                        </Destaque>
                    ),
                },
                {
                    titulo: 'Como participar da Festa do Pijama',
                    conteudo: (
                        <Texto>
                            Escolha um aumigo, faça o seu cadastro e aguarde o contato da equipe para combinar a
                            noite.
                        </Texto>
                    ),
                },
                { titulo: 'Regras e cuidados na Festa do Pijama', dica: 'Liste o que levar, os cuidados com o animal e as regras da noite.' },
                {
                    id: 'lar-temporario',
                    titulo: 'Lar temporário',
                    larga: true,
                    conteudo: (
                        <Destaque src="/larTemporario.png" alt="Lar temporário">
                            <Texto>
                                Você não precisa adotar para ajudar. Ao oferecer um lar temporário, você abriga um cão
                                ou gato até que ele encontre uma família definitiva. Um pouco de espaço e carinho podem
                                mudar um destino.
                            </Texto>
                        </Destaque>
                    ),
                },
                { titulo: 'Como oferecer um lar temporário', dica: 'Explique o cadastro, a avaliação e a entrega do animal.' },
                { titulo: 'Requisitos e cuidados', dica: 'Informe o que é preciso ter e quais cuidados o lar temporário envolve.' },
                {
                    titulo: 'Ficou com dúvidas?',
                    larga: true,
                    conteudo: (
                        <>
                            <Texto>Veja as respostas para as perguntas mais comuns sobre adoção, passeio e lar temporário.</Texto>
                            <Acoes>
                                <LinkBotao href="/quem-somos/perguntas-frequentes">Perguntas frequentes</LinkBotao>
                            </Acoes>
                        </>
                    ),
                },
            ]}
        />
    )
}
