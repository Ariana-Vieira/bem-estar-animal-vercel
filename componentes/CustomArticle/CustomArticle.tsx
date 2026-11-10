import style from "./CustomArticle.module.css"


interface CustomArticle {
    title : string; // Titulo para o h3
    texto : string; // Texto para o p
    
}


export const CustomArticle = (props : CustomArticle) => {

    const title = props.title;
    const texto = props.texto;

    return (
        <article className={`${style["card-atividade"]} card-passeio`}>
            <div className={style["card-passeio-wrapper"]}>
                <div className={style["card-passeio-header"]}>
                    <h3>{ title }</h3>
                </div>
                <div className={style["card-passeio-content-wrapper"]}>
                    <div className={style["card-passeio-text-container"]}>
                        <img src="./bg_passeio.png" alt="Passeio com cão" className="card-passeio-img" />
                        <p>{ texto }</p>
                    </div>
                </div>
                
            </div>
        </article>
    )
}