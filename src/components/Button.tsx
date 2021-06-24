import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

// chamando a função HTMLButtonElement com todas as propriedades que um botão HTML pode receber
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return (
    // incluindo um JS, colocar as chaves
    <button className="button" {...props} />
  )
}

// named export