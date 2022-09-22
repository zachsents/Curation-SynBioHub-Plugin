import ReactDOMServer from 'react-dom/server'
import App from '../client/App'
import { AppProvider } from '../client/context'

export function render(url, context = {}) {
    return ReactDOMServer.renderToString(
        <AppProvider value={context}>
            <App {...context} />
        </AppProvider>
    )
}