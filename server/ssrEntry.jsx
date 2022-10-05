import ReactDOMServer from 'react-dom/server'
import App from '../client/App'
import { AppProvider } from '../client/context'
import createStore from '../client/store'

export function render(url, context = {}) {

    // create store with passed context
    createStore(context)

    // server render
    return ReactDOMServer.renderToString(
        <AppProvider value={context}>
            <App {...context} />
        </AppProvider>
    )
}