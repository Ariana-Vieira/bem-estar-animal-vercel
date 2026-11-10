import type { Metadata } from 'next'
import { CustomPaginaServico } from '@/componentes/CustomPaginaServico/CustomPaginaServico'

export const metadata: Metadata = { title: 'Vacinação Antirrábica | Bem-Estar Animal' }

export default function Page() {
    return (
        <CustomPaginaServico
            categoria="Assistência Veterinária"
            titulo="Vacinação Antirrábica"
            resumo="Onde e quando vacinar seu cão ou gato contra a raiva."
            secoes={[
                { titulo: 'Por que vacinar', dica: 'Explique a importância da vacinação antirrábica.' },
                { titulo: 'Quem deve vacinar', dica: 'Informe espécies e idades indicadas.' },
                { titulo: 'Onde e quando vacinar', dica: 'Informe locais, dias e horários de vacinação.' },
                { titulo: 'Campanhas de vacinação', dica: 'Informe as datas das campanhas do ano.' },
                { titulo: 'O que levar', dica: 'Liste os documentos e a carteira de vacinação.' },
                { titulo: 'Dúvidas frequentes', dica: 'Reúna as perguntas mais comuns e as respostas.' },
            ]}
        />
    )
}
