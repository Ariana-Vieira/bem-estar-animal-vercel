import React from "react";


interface CustomTextProps {
    children? : React.ReactNode;
    className? : string;
    texto? : string;
}

export const CustomText = (props : CustomTextProps) => {
    const texto = props.texto;

    return (
        <div>
            {texto}
        </div>
    )
}