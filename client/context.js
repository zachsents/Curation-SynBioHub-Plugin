import { createContext, useContext } from "react"


const appContext = createContext({})

export const AppProvider = appContext.Provider
export const useAppContext = () => useContext(appContext)