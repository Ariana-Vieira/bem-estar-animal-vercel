import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Clínicas Credenciadas | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Clínicas Credenciadas"
            resumo="Clínicas veterinárias parceiras do programa municipal."
            secoes={[
                { titulo: 'Como funciona o credenciamento', dica: 'Explique a relação entre as clínicas e o programa.' },
                { titulo: 'Lista de clínicas', dica: 'Inclua nome, endereço, telefone e serviços de cada clínica.' },
                { titulo: 'Como se tornar clínica credenciada', dica: 'Descreva requisitos e etapas para o credenciamento.' },
                { titulo: 'Contato', dica: 'Informe o canal para falar com o departamento.' },
            ]}
        />
    )
}
