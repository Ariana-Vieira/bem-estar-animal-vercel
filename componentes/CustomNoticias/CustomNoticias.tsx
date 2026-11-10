

export const CustomNoticias = () => {

    return (
        <section className="noticias py-5">
        <div className="container">
            <h3 className="titulo-noticias">ÚLTIMAS NOTÍCIAS</h3>
            <div className="container-noticias">
                <div className="wrapper-noticias">
                    <article className="card-noticia card-grande">
                        <div className="img-wrapper">
                            <img src="/caseSucesso.png" alt="Adoção de sucesso" className="img-noticia" />
                        </div>
                        <div className="conteudo-noticia">
                            <h4 className="titulo-noticia">Mais uma adoção de sucesso</h4>
                            <p className="texto-noticia">Max, um vira-lata cheio de energia, esperou meses por uma família no canil municipal. Tudo mudou quando Rafael o conheceu pela Meetin'Pet — foi amor à primeira vista! Hoje, Max vive cercado de carinho, brincadeiras e muito afeto. "Ele trouxe alegria pra nossa casa", conta Rafael. Histórias como essa mostram que adotar é transformar vidas. </p>
                            <p className="frase-destaque">
                                "💛 Adote, não compre. Dê uma nova chance a quem só precisa de amor." 
                                <span className="material-symbols-rounded icone-amarelo">favorite</span>
                            </p>
                        </div>
                    </article>
                    <div className="cards-direita">
                        <article className="card-noticia card-pequeno card-passeio">
                            <div className="conteudo-wrapper">
                                <div className="img-wrapper-passeio">
                                    <img src="/diaDePasseio.png" alt="Dia de passeio" className="img-noticia-passeio" />
                                </div>
                                <div className="conteudo-noticia-passeio">
                                    <h4 className="titulo-noticia-passeio">Dia de passeio, carinho em forma de caminhada</h4>
                                    <p className="texto-noticia-passeio">Nem todo mundo pode adotar, mas todo mundo pode fazer um animal feliz. No Dia de Passeio, você pode levar um cão do abrigo para caminhar, oferecendo atenção e alegria por algumas horas. Uma simples caminhada faz toda a diferença para os animais e para o coração de quem participa.</p>
                                    <p className="frase-destaque-passeio">
                                        "Participe! Caminhar com amor também é adotar um sorriso." 💚
                                    </p>
                                </div>
                            </div>
                        </article>
                        <article className="card-noticia card-pequeno card-passeio">
                            <div className="conteudo-wrapper">
                                <div className="img-wrapper-passeio">
                                    <img src="/larTemporario.png" alt="Lar temporário" className="img-noticia-passeio" />
                                </div>
                                <div className="conteudo-noticia-passeio">
                                    <h4 className="titulo-noticia-passeio">Lar temporário, você também pode!</h4>
                                    <p className="texto-noticia-passeio">Você não precisa adotar para ajudar. Ao oferecer um lar temporário, você abriga um cão ou gato até que ele encontre uma família definitiva. Um pouco de espaço e carinho podem mudar um destino.</p>
                                    <p className="frase-destaque-passeio">
                                        "Seja um lar temporário. Dê amor por um tempo, mude uma vida pra sempre." 
                                        <span className="material-symbols-rounded icone-laranja">favorite</span>
                                        <span className="material-symbols-rounded icone-pata">pets</span>
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}