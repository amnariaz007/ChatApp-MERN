import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import { SocketProvider } from './context/SocketContext.jsx'
//import MessageBar from './pages/chat/Components/ChatContainer/Components/message-bar/index.jsx'


createRoot(document.getElementById('root')).render(
  <>

    <SocketProvider>
      <App />
   
      <Toaster closeButton />
    </SocketProvider>
  </>


)
