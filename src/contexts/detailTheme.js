import { createContext } from 'react'

// El detalle publica su superficie tematica; Layout la pasa al Footer.
// null en el resto de paginas: el footer queda neutro.
export const DetailThemeContext = createContext(null)
