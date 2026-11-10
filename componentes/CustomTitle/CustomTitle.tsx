import style from "./CustomTitle.module.css"


interface CustomTitleProps {
    title : string;
    id? : string;
    style? : React.CSSProperties;
    className?: string;
}

export const CustomTitle = (props : CustomTitleProps) => {
    const title = props.title;
    


    return (
        <section className={ style.title }>
			<h1 className={style.titleH1} >{ title }</h1>	 
	    </section>
    )
}
