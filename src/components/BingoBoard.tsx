import { useState } from 'react'
import { Box, Flex, Text, Button, Drawer } from '@chakra-ui/react'
import { useBingoStore } from '../store/bingoStore'
import { useNavigate } from 'react-router-dom'
import { clearState } from '../utils/storage'
import CurrentNumber from './CurrentNumber'
import DrawButton from './DrawButton'
import HistoryGrid from './HistoryGrid'
import BingoOverlay from './BingoOverlay'
import EditPanel from './EditPanel'
import confetti from 'canvas-confetti'

export default function BingoBoard() {
  const theme = useBingoStore((s) => s.theme)
  const title = useBingoStore((s) => s.title)
  const drawnNumbers = useBingoStore((s) => s.drawnNumbers)
  const bingo = useBingoStore((s) => s.bingo)
  const reset = useBingoStore((s) => s.reset)
  const navigate = useNavigate()
  const [showBingo, setShowBingo] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  function handleBingo() {
    bingo()
    setShowBingo(true)
    confetti({
      particleCount: 150,
      spread: 70,
      startVelocity: 60,
      origin: { y: 0.6 },
    })
  }

  function handleReset() {
    if (window.confirm('Tem certeza que deseja reiniciar o bingo? Todo o progresso será perdido.')) {
      reset()
    }
  }

  function handleNewBingo() {
    if (window.confirm('Criar um novo bingo? O atual será apagado.')) {
      clearState()
      navigate('/')
    }
  }

  return (
    <Flex direction="column" h="100vh" w="100vw" overflow="hidden">
      {/* Header */}
      <Box
        bg={theme.headerColor}
        px={6}
        py={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        borderBottom="2px solid whiteAlpha.200"
        boxShadow={`0 4px 20px ${theme.primaryColor}20`}
      >
        <Text
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="900"
          color={theme.textColor}
          textTransform="uppercase"
          letterSpacing="0.05em"
          textAlign="center"
          style={{ textShadow: `0 0 20px ${theme.primaryColor}40` }}
        >
          {title}
        </Text>
        <Box display="flex" gap={2} position="absolute" right={6}>
          <Button
            size="sm"
            variant="ghost"
            color={theme.textColor}
            onClick={handleNewBingo}
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            Novo Bingo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            color={theme.textColor}
            onClick={() => setEditOpen(true)}
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            Editar
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Flex flex={1} overflow="hidden">
        {/* Left Panel */}
        <Box
          flex={2}
          bg={theme.leftPanelColor}
          bgImage={theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none'}
          bgSize="cover"
          backgroundPosition="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={8}
          p={8}
          position="relative"
        >
          <CurrentNumber />
          <DrawButton />
          <Button
            size="xl"
            bg="red.500"
            color="white"
            fontSize="xl"
            fontWeight="bold"
            px={12}
            _hover={{ bg: 'red.600' }}
            onClick={handleBingo}
          >
            BINGO!
          </Button>
        </Box>

        {/* Right Panel - History */}
        <Box
          flex={1}
          minW="250px"
          maxW="350px"
          bg={theme.rightPanelColor}
          borderLeft="1px solid whiteAlpha.100"
          display="flex"
          flexDirection="column"
        >
          <Box px={4} py={3} borderBottom="1px solid whiteAlpha.100">
            <Text fontSize="sm" fontWeight="semibold" color={theme.textColor} opacity={0.8}>
              Sorteados ({drawnNumbers.length})
            </Text>
          </Box>
          <Box flex={1} overflowY="auto" p={4}>
            <HistoryGrid />
          </Box>
        </Box>
      </Flex>

      {/* Footer */}
      <Box
        bg={theme.headerColor}
        px={6}
        py={2}
        display="flex"
        justifyContent="flex-end"
        borderTop="1px solid whiteAlpha.100"
      >
        <Button
          size="sm"
          variant="ghost"
          color={theme.textColor}
          opacity={0.6}
          onClick={handleReset}
          _hover={{ opacity: 1, bg: 'whiteAlpha.100' }}
        >
          Sortear Novamente
        </Button>
      </Box>

      {/* Bingo Overlay */}
      <BingoOverlay isOpen={showBingo} onClose={() => setShowBingo(false)} />

      {/* Edit Drawer */}
      <Drawer.Root open={editOpen} onOpenChange={(e) => setEditOpen(e.open)} size="md">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={theme.rightPanelColor} color={theme.textColor}>
            <Drawer.Header>
              <Drawer.Title>Editar Bingo</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <EditPanel />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <Button size="sm" variant="outline" borderColor="whiteAlpha.300" color={theme.textColor}>
                  Fechar
                </Button>
              </Drawer.CloseTrigger>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Flex>
  )
}
