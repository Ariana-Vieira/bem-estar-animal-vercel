import style from "./CustomContainer.module.css"

interface CustomContainerProps {
    children : React.ReactNode[];
}

export const CustomContainer = (props : CustomContainerProps) => {

    return (
        <section className={style["cards-atividades-container"]}>
            <div className={style["cards-atividades-wrapper"]}>
            
            </div>
            {...props.children}
	    </section>
    )
}