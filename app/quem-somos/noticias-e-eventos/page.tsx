import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { Destaque, LinkAcao, Texto } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Notícias e Eventos | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Notícias e Eventos"
            resumo="Novidades, histórias de adoção e ações do Departamento de Proteção e Bem-Estar Animal."
            secoes={[
                {
                    titulo: 'Últimas notícias',
                    larga: true,
                    conteudo: (
                        <>
                            <Destaque src="/caseSucesso.png" alt="Adoção de sucesso" titulo="Mais uma adoção de sucesso">
                                <Texto>
                                    Max, um vira-lata cheio de energia, esperou meses por uma família no canil municipal.
                                    Tudo mudou quando Rafael o conheceu pela Meetin&apos;Pet — foi amor à primeira vista!
                                    Hoje, Max vive cercado de carinho, brincadeiras e muito afeto. &quot;Ele trouxe alegria
                                    pra nossa casa&quot;, conta Rafael. Histórias como essa mostram que adotar é transformar vidas.
                                </Texto>
                            </Destaque>
                            <Destaque src="/diaDePasseio.png" alt="Dia de passeio" titulo="Dia de passeio, carinho em forma de caminhada">
                                <Texto>
                                    Nem todo mundo pode adotar, mas todo mundo pode fazer um animal feliz. No Dia de
                                    Passeio, você pode levar um cão do abrigo para caminhar, oferecendo atenção e alegria
                                    por algumas horas. Uma simples caminhada faz toda a diferença para os animais e para
                                    o coração de quem participa.
                                </Texto>
                            </Destaque>
                            <Destaque src="/larTemporario.png" alt="Lar temporário" titulo="Lar temporário, você também pode!">
                                <Texto>
                                    Você não precisa adotar para ajudar. Ao oferecer um lar temporário, você abriga um cão
                                    ou gato até que ele encontre uma família definitiva. Um pouco de espaço e carinho podem
                                    mudar um destino.
                                </Texto>
                            </Destaque>
                        </>
                    ),
                },
                {
                    titulo: 'Ações em destaque',
                    larga: true,
                    conteudo: (
                        <>
                            <Destaque src="/festadopijama.avif" alt="Pessoa com aumigo assistindo filme" titulo="Festa do Pijama com um Aumigo">
                                <Texto>
                                    A Festa do Pijama é uma ação especial que incentiva a adoção por meio da convivência.
                                    A proposta é que a pessoa possa levar um animal para passar uma noite em seu lar,
                                    vivendo um momento real de interação, carinho e companhia.
                                </Texto>
                            </Destaque>
                            <Destaque src="/fotopasseio.jpg" alt="Pessoa levando cachorro para passear" titulo="Passear com um Aumigo">
                                <Texto>
                                    O programa &quot;Passear com o Animal&quot; é voltado para quem deseja contribuir, mas não
                                    pode adotar no momento. A iniciativa permite que qualquer pessoa cadastrada realize
                                    caminhadas e passeios com os animais.
                                </Texto>
                                <LinkAcao href="/adocao-responsavel#passeio">Saiba mais</LinkAcao>
                            </Destaque>
                        </>
                    ),
                },
                { titulo: 'Agenda de eventos', dica: 'Liste os próximos eventos com data, horário e local.' },
                { titulo: 'Arquivo de notícias', dica: 'Reúna as notícias mais antigas, organizadas por data.' },
            ]}
        />
    )
}
