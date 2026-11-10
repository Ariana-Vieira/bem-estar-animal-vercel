import { CustomButton } from "../CustomButton/CustomButton";
import style from "./CustomAnimalCard.module.css"
import Link from "next/link"


interface CustomAnimalCardProps {
    nome: string;
    imagem: string;
    especie: string;
    sexo: string;
    porte: string;
    idade: string;
    peso: string;
    raca: string;
    vacinacao: boolean;
    

}

export const CustomAnimalCard = ({
  nome,
  imagem,
  sexo,
  raca,
  vacinacao
}: CustomAnimalCardProps) => {

    return (
        <article className={style.card}> 
            <img src={imagem} alt={nome} />

            <h2>{nome}</h2><span></span>
            <p>Raça: {raca}</p><span></span>
            <p>Sexo: {sexo}</p><span></span>
            <p>Vacinação: {vacinacao ? "Sim" : "Não"}</p><span></span>

            <Link href={`/meetinpet/${nome.toLowerCase()}`}>
                <CustomButton label="Ver Mais" className={style.cardButton} target="_blank" /> {/* Arrumar o color, ta puxando da class la do comp button */}
            </Link>
        </article>
    )
}