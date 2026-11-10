
interface CustomButtonProps {
  label: string
  href?: string
  onClick?: () => void
  target?: string
  className?: string
  
}


export const CustomButton = ({
    label,
    href,
    onClick,
    target = "_blank",
    className = "",
    
}: CustomButtonProps) => {
    if (href) {
        return (
        <a 
            href={href} 
            target={target} 
            className={`card-passeio-btn ${className}`}
            
        >
            {label}
        </a>
    )
}

    return (
        <button 
            onClick={onClick} 
            className={`card-passeio-btn ${className}`}
        > {label}
        </button>
    )
}