import ReactDOM from 'react-dom/client'
import App from './App'
import { AppProvider } from "./context"
import createStore from "./store"

// create store with passed context
createStore(window.__CONTEXT__)

// hydrate client
ReactDOM.hydrateRoot(
    document.getElementById('root'),
    <AppProvider value={window.__CONTEXT__}>
        <App />
    </AppProvider>
)