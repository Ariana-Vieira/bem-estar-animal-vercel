import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Atendimento Clínico | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Atendimento Clínico"
            resumo="Atendimento veterinário na clínica municipal para cães e gatos."
            secoes={[
                { titulo: 'O que é o atendimento', dica: 'Descreva quais atendimentos a clínica realiza.' },
                { titulo: 'Quem pode ser atendido', dica: 'Informe o público e os critérios, se houver.' },
                { titulo: 'Como ser atendido', dica: 'Explique se há agendamento, senha ou ordem de chegada.' },
                { titulo: 'Endereço e horários', dica: 'Informe o local, os dias e os horários de funcionamento.' },
                { titulo: 'Documentos necessários', dica: 'Liste os documentos do tutor e do animal.' },
                { titulo: 'Dúvidas frequentes', dica: 'Reúna as perguntas mais comuns e as respostas.' },
            ]}
        />
    )
}
