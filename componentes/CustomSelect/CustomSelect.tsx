'use client'

import { useEffect, useRef, useState } from "react"
import style from "./CustomSelect.module.css"

interface SelectOption {
  label: string
  value: string
  icone?: string
}

interface CustomSelectProps {
  id?: string
  placeholder?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  icone?: string
}

// Menu suspenso próprio (o <select> nativo desenha a lista do navegador e não deixa estilizar).
// Teclado: setas, Enter/Espaço escolhem, Esc fecha. Leitores de tela: botão + lista com role="listbox".
export const CustomSelect = ({
  id,
  placeholder,
  options,
  value,
  onChange,
  icone
}: CustomSelectProps) => {
  const [aberto, setAberto] = useState(false)
  const [ativo, setAtivo] = useState(0) // item destacado (mouse ou setas)
  const raizRef = useRef<HTMLDivElement>(null)

  const escolhida = options.find((o) => o.value === value)
  // Com um filtro escolhido, a lista ganha "Todos" no começo para poder limpar só este filtro
  const itens: SelectOption[] = value ? [{ label: "Todos", value: "" }, ...options] : options

  // Fecha ao clicar/tocar fora
  useEffect(() => {
    if (!aberto) return
    const fora = (e: PointerEvent) => {
      if (!raizRef.current?.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener("pointerdown", fora)
    return () => document.removeEventListener("pointerdown", fora)
  }, [aberto])

  const abrir = () => {
    setAtivo(Math.max(0, itens.findIndex((i) => i.value === (value ?? ""))))
    setAberto(true)
  }

  const escolher = (valor: string) => {
    onChange?.(valor)
    setAberto(false)
  }

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (!aberto) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault()
        abrir()
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setAtivo((a) => Math.min(a + 1, itens.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setAtivo((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      escolher(itens[ativo].value)
    } else if (e.key === "Escape" || e.key === "Tab") {
      setAberto(false)
    }
  }

  const idLista = id ? `${id}-lista` : undefined

  return (
    <div className={style.raiz} ref={raizRef}>
      <button
        type="button"
        id={id}
        className={`${style.botao}${value ? ` ${style.selecionado}` : ""}${aberto ? ` ${style.aberto}` : ""}`}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={idLista}
        aria-label={escolhida ? `${placeholder}: ${escolhida.label}` : placeholder}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={aoTeclar}
      >
        <span className={style.icone} aria-hidden="true">{escolhida?.icone ?? icone}</span>
        <span className={style.texto}>{escolhida ? escolhida.label : placeholder}</span>
        <span className={`material-symbols-rounded ${style.seta}`} aria-hidden="true">expand_more</span>
      </button>

      {aberto && (
        <ul id={idLista} role="listbox" className={style.lista}>
          {itens.map((item, i) => (
            <li
              key={item.value || "todos"}
              role="option"
              aria-selected={!!value && item.value === value}
              className={`${style.item}${i === ativo ? ` ${style.itemAtivo}` : ""}${!!value && item.value === value ? ` ${style.itemSelecionado}` : ""}`}
              onMouseEnter={() => setAtivo(i)}
              onClick={() => escolher(item.value)}
            >
              {item.icone && <span className={style.itemIcone} aria-hidden="true">{item.icone}</span>}
              <span className={style.itemTexto}>{item.label}</span>
              {!!value && item.value === value && (
                <span className={`material-symbols-rounded ${style.itemCheck}`} aria-hidden="true">check</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
