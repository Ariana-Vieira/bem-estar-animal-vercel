import { Alert } from "react-bootstrap";

interface CustomAlertProps {
    message? : string;
    show? : boolean;
    variant? : "warning" | "success";
}

export const CustomAlert = (props : CustomAlertProps) => {
    const message = props.message;
    const show = props.show;
    const variant = props.variant;

    return (
        <Alert variant={variant} dismissible show={show === undefined ? false : show}>
            {message}
        </Alert>
    )
}