import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Castração Gratuita | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Castração Gratuita"
            resumo="Informações para solicitar a castração de cães e gatos."
            secoes={[
                { titulo: 'O que é o serviço', dica: 'Explique o programa de castração do município.' },
                { titulo: 'Quem pode solicitar', dica: 'Informe os critérios de participação.' },
                { titulo: 'Como solicitar (passo a passo)', dica: 'Descreva as etapas, do cadastro até a data da cirurgia.' },
                { titulo: 'Documentos necessários', dica: 'Liste os documentos exigidos.' },
                { titulo: 'Cuidados antes e depois da cirurgia', dica: 'Inclua as orientações de jejum, transporte e recuperação.' },
                { titulo: 'Acompanhar solicitação e contato', dica: 'Informe como acompanhar o pedido e falar com o departamento.' },
            ]}
        />
    )
}
