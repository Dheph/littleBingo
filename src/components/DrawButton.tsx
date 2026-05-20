import { Button } from '@chakra-ui/react'
import { useBingoStore } from '../store/bingoStore'

export default function DrawButton() {
  const draw = useBingoStore((s) => s.draw)
  const theme = useBingoStore((s) => s.theme)
  const totalNumbers = useBingoStore((s) => s.totalNumbers)
  const drawnNumbers = useBingoStore((s) => s.drawnNumbers)
  const isComplete = drawnNumbers.length >= totalNumbers

  return (
    <Button
      size="xl"
      bg={theme.buttonColor}
      color="white"
      fontSize="xl"
      fontWeight="bold"
      px={12}
      py={8}
      _hover={{ opacity: 0.9 }}
      _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
      onClick={draw}
      disabled={isComplete}
    >
      {isComplete ? 'Todos os números foram sorteados.' : 'SORTEAR'}
    </Button>
  )
}
