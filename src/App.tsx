import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useBingoStore } from './store/bingoStore'
import WizardSetup from './components/WizardSetup'
import BingoBoard from './components/BingoBoard'

function App() {
  const isSetup = useBingoStore((s) => s.isSetup)

  return (
    <Box minH="100vh" w="100vw" overflow="hidden">
      <Routes>
        <Route path="/" element={isSetup ? <Navigate to="/bingo" replace /> : <WizardSetup />} />
        <Route path="/bingo" element={isSetup ? <BingoBoard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}

export default App
