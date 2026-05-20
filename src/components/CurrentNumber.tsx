import { Box, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBingoStore } from '../store/bingoStore'

const MotionText = motion(Text)

export default function CurrentNumber() {
  const currentNumber = useBingoStore((s) => s.currentNumber)
  const theme = useBingoStore((s) => s.theme)
  const totalNumbers = useBingoStore((s) => s.totalNumbers)
  const drawnNumbers = useBingoStore((s) => s.drawnNumbers)

  return (
    <Box textAlign="center">
      <Text fontSize="lg" opacity={0.5} mb={4}>
        Número Atual
      </Text>
      <Box minH="200px" display="flex" alignItems="center" justifyContent="center">
        <AnimatePresence mode="wait">
          {currentNumber !== null ? (
            <MotionText
              key={currentNumber}
              fontSize="9xl"
              fontWeight="bold"
              color={theme.textColor}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              lineHeight={1}
            >
              {currentNumber}
            </MotionText>
          ) : (
            <MotionText
              key="empty"
              fontSize="5xl"
              opacity={0.3}
              color={theme.textColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Clique em SORTEAR
            </MotionText>
          )}
        </AnimatePresence>
      </Box>
      <Text fontSize="sm" opacity={0.4} mt={4}>
        {drawnNumbers.length} de {totalNumbers} sorteados
      </Text>
    </Box>
  )
}
