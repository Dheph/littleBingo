import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Button, Text } from '@chakra-ui/react'
import { useBingoStore } from './store/bingoStore'
import LandingPage from './components/LandingPage'
import WizardSetup from './components/WizardSetup'
import BingoBoard from './components/BingoBoard'

function App() {
  const isSetup = useBingoStore((s) => s.isSetup)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    const currentVersion = localStorage.getItem('bingo-app-version')

    fetch(`${base}version.json?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        const serverVersion = data.version
        if (currentVersion && currentVersion !== serverVersion) {
          setUpdateAvailable(true)
        }
        localStorage.setItem('bingo-app-version', serverVersion)
      })
      .catch(() => {})
  }, [])

  return (
    <Box minH="100vh" w="100vw" overflow="hidden" position="relative">
      {updateAvailable && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={99999}
          bg="orange.500"
          color="white"
          px={4}
          py={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={3}
          fontSize="sm"
          fontWeight="semibold"
          boxShadow="0 2px 12px rgba(0,0,0,0.3)"
        >
          <Text>Nova versão disponível!</Text>
          <Button
            size="xs"
            bg="white"
            color="orange.600"
            fontWeight="bold"
            onClick={() => window.location.reload()}
            _hover={{ bg: 'orange.100' }}
          >
            Recarregar
          </Button>
        </Box>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={isSetup ? <Navigate to="/bingo" replace /> : <WizardSetup />} />
        <Route path="/bingo" element={isSetup ? <BingoBoard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}

export default App
