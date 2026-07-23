import { ViteReactSSG } from 'vite-react-ssg'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import './styles/global.css'
import './styles/pages.css'

// This site has no route loaders. vite-react-ssg still injects client loaders that
// fetch static-loader-data/*.json on every in-app navigation. When that request
// returns HTML (404 / soft-fallback), React Router crashes with:
//   Unexpected token '<', "<!DOCTYPE "... is not valid JSON
// Strip those loaders so client-side redirects/navigation stay resilient on Vercel.
function stripClientLoaders(routeList) {
  return routeList.map((route) => {
    const next = { ...route }
    delete next.loader
    if (Array.isArray(next.children)) next.children = stripClientLoaders(next.children)
    return next
  })
}

export const createRoot = ViteReactSSG({
  routes,
  customCreateRouter: (dataRoutes, opts) =>
    createBrowserRouter(stripClientLoaders(dataRoutes), opts),
})
