import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Mutirões de Castração | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Mutirões de Castração"
            resumo="Datas, inscrições e orientações dos mutirões de castração."
            secoes={[
                { titulo: 'Próximos mutirões', dica: 'Informe datas e locais dos próximos mutirões.' },
                { titulo: 'Como se inscrever', dica: 'Explique onde e como fazer a inscrição.' },
                { titulo: 'Vagas e critérios', dica: 'Informe o número de vagas e os critérios de seleção.' },
                { titulo: 'Documentos necessários', dica: 'Liste os documentos exigidos na inscrição.' },
                { titulo: 'Orientações para o dia da cirurgia', dica: 'Inclua horário, jejum e o que levar.' },
                { titulo: 'Mutirões anteriores', dica: 'Se desejar, registre resultados de mutirões já realizados.' },
            ]}
        />
    )
}
