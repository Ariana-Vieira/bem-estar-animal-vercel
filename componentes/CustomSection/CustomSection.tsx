import React from "react";
import style from "./CustomSection.module.css"

interface CustomSectionProps {
    children : React.ReactNode;
    className? : string;
}

export const CustomSection = (props : CustomSectionProps) => {
    const sectionClassName = props.className
        ? `${style["filtro-container"]} ${props.className}`
        : style["filtro-container"]

    return (
        <section className={sectionClassName}>
            {props.children}
        </section>
    )
}