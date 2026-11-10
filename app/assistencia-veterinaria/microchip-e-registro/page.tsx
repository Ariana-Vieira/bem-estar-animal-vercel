import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Microchip e Registro do Pet | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Microchip e Registro do Pet"
            resumo="Identificação e registro de cães e gatos do município."
            secoes={[
                { titulo: 'O que são microchip e registro', dica: 'Explique o microchip e o registro do animal.' },
                { titulo: 'Quem pode solicitar', dica: 'Informe os critérios, se houver.' },
                { titulo: 'Como solicitar', dica: 'Descreva as etapas do pedido.' },
                { titulo: 'Documentos necessários', dica: 'Liste os documentos do tutor e do animal.' },
                { titulo: 'Onde fazer', dica: 'Informe locais, dias e horários.' },
                { titulo: 'Dúvidas frequentes', dica: 'Reúna as perguntas mais comuns e as respostas.' },
            ]}
        />
    )
}
