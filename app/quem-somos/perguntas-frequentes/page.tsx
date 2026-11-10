import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { Faq } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Perguntas Frequentes | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Perguntas Frequentes"
            resumo="Respostas para as dúvidas mais comuns sobre o departamento e a plataforma."
            secoes={[
                {
                    titulo: 'Sobre o departamento e a plataforma',
                    larga: true,
                    conteudo: (
                        <Faq
                            itens={[
                                {
                                    pergunta: 'O que é o DPBEA?',
                                    resposta: 'O Departamento de Proteção e Bem-Estar Animal (DPBEA) é o setor responsável por promover ações que garantem a proteção, cuidado e qualidade de vida dos animais do município de Votorantim.',
                                },
                                {
                                    pergunta: 'Como encontro um animal para adotar?',
                                    resposta: 'Pela plataforma, na página de Adoção Responsável, você vê os cães e gatos disponíveis para adoção e pode responder ao quiz com os mascotes Sol e Lua.',
                                },
                                {
                                    pergunta: 'O que é a Festa do Pijama?',
                                    resposta: 'É uma ação que incentiva a adoção por meio da convivência: a pessoa leva um animal para passar uma noite em seu lar, vivendo um momento real de interação, carinho e companhia.',
                                },
                                {
                                    pergunta: 'Não posso adotar. Como posso ajudar?',
                                    resposta: 'Você pode participar do programa Passear com o Animal, que permite a qualquer pessoa cadastrada fazer caminhadas e passeios com os animais, ou oferecer um lar temporário.',
                                },
                                {
                                    pergunta: 'O que é um lar temporário?',
                                    resposta: 'É quando você abriga um cão ou gato até que ele encontre uma família definitiva.',
                                },
                            ]}
                        />
                    ),
                },
                { titulo: 'Adoção', dica: 'Inclua perguntas sobre requisitos, documentos, prazo e acompanhamento da adoção.' },
                { titulo: 'Castração e vacinação', dica: 'Inclua perguntas sobre quem pode solicitar, custos, agendamento e cuidados.' },
                { titulo: 'Banco de Ração', dica: 'Inclua perguntas sobre doação, retirada e quem pode receber.' },
                { titulo: 'Pets perdidos e encontrados', dica: 'Inclua perguntas sobre como registrar e como acompanhar um caso.' },
            ]}
        />
    )
}
