import { ButtonHTMLAttributes } from 'react'

import './styles.scss'

// chamando a função HTMLButtonElement com todas as propriedades que um botão HTML pode receber
// além dos atributos normais de um botão, podemos colocar um objeto com propriedades adicionais que quisermos
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
}

// desestruturando, o que não for "isOutlined" ficará em ...props, deixando com o mesmo funcionamento de antes
export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    // incluindo um JS, colocar as chaves
    <button
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props}
    />
  )
}

// named export