import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { Itens, LinkAcao } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Seja Voluntário | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Seja Voluntário"
            resumo="Nem todo mundo pode adotar, mas todo mundo pode ajudar. Veja as formas de participar."
            secoes={[
                {
                    titulo: 'Formas de ajudar',
                    larga: true,
                    conteudo: (
                        <>
                            <Itens
                                itens={[
                                    {
                                        titulo: 'Passear com um Aumigo',
                                        texto: 'Para quem deseja contribuir, mas não pode adotar no momento: qualquer pessoa cadastrada pode realizar caminhadas e passeios com os animais, oferecendo estímulo físico, socialização e momentos de alegria.',
                                    },
                                    {
                                        titulo: 'Lar temporário',
                                        texto: 'Você abriga um cão ou gato até que ele encontre uma família definitiva. Um pouco de espaço e carinho podem mudar um destino.',
                                    },
                                    {
                                        titulo: 'Festa do Pijama',
                                        texto: 'Leve um animal para passar uma noite em seu lar, vivendo um momento real de interação, carinho e companhia.',
                                    },
                                    {
                                        titulo: 'Banco de Ração',
                                        texto: 'Colabore com doações para apoiar os animais e as famílias atendidas.',
                                    },
                                ]}
                            />
                            <LinkAcao href="/racao">Conheça o Banco de Ração</LinkAcao>
                        </>
                    ),
                },
                { titulo: 'Como se cadastrar', dica: 'Explique o passo a passo para virar voluntário.' },
                { titulo: 'Requisitos e documentos', dica: 'Informe idade mínima, documentos e termos necessários.' },
                { titulo: 'Rotina e horários', dica: 'Descreva dias, horários e atividades dos voluntários.' },
                { titulo: 'Contato do voluntariado', dica: 'Informe o canal para tirar dúvidas e se candidatar.' },
            ]}
        />
    )
}
