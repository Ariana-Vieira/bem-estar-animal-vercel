import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'
import { LinkAcao, Texto } from '@/componentes/CustomPaginaServico/CustomConteudoServico'

export const metadata: Metadata = { title: 'Estrutura e Equipe | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            titulo="Estrutura e Equipe"
            resumo="Conheça como o Departamento de Proteção e Bem-Estar Animal se organiza e quem participa do projeto."
            secoes={[
                {
                    titulo: 'Parcerias',
                    conteudo: (
                        <>
                            <Texto>
                                O Projeto Bem-Estar Animal é desenvolvido em parceria com a Secretaria de Meio
                                Ambiente da Prefeitura de Votorantim.
                            </Texto>
                            <Texto>
                                A plataforma é desenvolvida pelos alunos do curso de Desenvolvimento de Software
                                Multiplataforma da Fatec Votorantim, por meio dos projetos integradores.
                            </Texto>
                            <LinkAcao href="/projeto">Conheça o projeto</LinkAcao>
                        </>
                    ),
                },
                {
                    titulo: 'Orientação técnica',
                    conteudo: (
                        <Texto>
                            O planejamento e o desenvolvimento do projeto são orientados pela médica veterinária
                            Evelyn e sua equipe. A apresentação do projeto contou com diversos profissionais da
                            secretaria e com o secretário.
                        </Texto>
                    ),
                },
                {
                    titulo: 'Equipe do departamento',
                    dica: 'Liste nomes, cargos e funções de quem atua no departamento.',
                },
                {
                    titulo: 'Setores e organograma',
                    dica: 'Descreva os setores (clínica, adoção, banco de ração etc.) e, se houver, inclua o organograma.',
                },
            ]}
        />
    )
}
