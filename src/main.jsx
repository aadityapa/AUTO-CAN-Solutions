import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './styles/global.css'
import './styles/pages.css'

export const createRoot = ViteReactSSG({ routes })
