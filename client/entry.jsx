import ReactDOM from 'react-dom/client'
import App from './App'
import { AppProvider } from "./context"


ReactDOM.hydrateRoot(
    document.getElementById('root'),
    <AppProvider value={window.__CONTEXT__}>
        <App />
    </AppProvider>
)