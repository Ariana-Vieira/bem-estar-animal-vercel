import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { Destaque, LinkAcao, Texto } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Nossos Mascotes Sol e Lua | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Nossos Mascotes Sol e Lua"
            resumo="Sol e Lua são os mascotes do Departamento de Proteção e Bem-Estar Animal."
            secoes={[
                {
                    titulo: 'Conheça Sol e Lua',
                    larga: true,
                    conteudo: (
                        <Destaque src="/SolLua.png" alt="Mascotes Sol e Lua" inteira>
                            <Texto>
                                Olá, muito prazer! Nós somos os mascotes do Departamento de Proteção e Bem-Estar
                                Animal, somos Sol e Lua.
                            </Texto>
                            <Texto>
                                Eles acompanham o quiz da página de Adoção Responsável: respondendo às perguntas,
                                você descobre se está apto a levar um deles para casa.
                            </Texto>
                            <LinkAcao href="/filtro">Fazer o quiz</LinkAcao>
                        </Destaque>
                    ),
                },
                { titulo: 'A história dos mascotes', dica: 'Conte como Sol e Lua foram criados e o que representam.' },
                { titulo: 'Personalidade de cada um', dica: 'Apresente cada mascote: nome, espécie, jeito e características.' },
                { titulo: 'Os mascotes nas campanhas', dica: 'Mostre onde Sol e Lua aparecem: campanhas, eventos e materiais.' },
                { titulo: 'Materiais para download', dica: 'Se houver, disponibilize imagens, cartazes ou atividades para baixar.' },
            ]}
        />
    )
}
