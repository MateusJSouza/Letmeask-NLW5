import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';

// compartilhando os dados de um contexto
export function useAuth() {
  const value = useContext(AuthContext)

  return value;
}