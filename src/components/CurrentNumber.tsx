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
      <Box minH="250px" display="flex" alignItems="center" justifyContent="center">
        <AnimatePresence mode="wait">
          {currentNumber !== null ? (
            <MotionText
              key={currentNumber}
              fontSize={{ base: '8rem', md: '12rem', lg: '16rem' }}
              fontWeight="900"
              color={theme.textColor}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              lineHeight={1}
              style={{ textShadow: `0 0 60px ${theme.primaryColor}40` }}
            >
              {currentNumber}
            </MotionText>
          ) : (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <MotionText
              key="empty"
              fontSize={{ base: '3rem', md: '4rem' }}
              opacity={0.3}
              color={theme.textColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Clique em SORTEAR
            </MotionText>
            <MotionText
              key="empty"
              fontSize={{ base: '1rem', md: '1.2rem' }}
              opacity={0.3}
              color={theme.textColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              [Espaço] sorteia · [B] bingo · [F] tela cheia
            </MotionText>
            </Box>
            
          )}
        </AnimatePresence>
      </Box>
      <Text fontSize="sm" opacity={0.4} mt={4}>
        {drawnNumbers.length} de {totalNumbers} sorteados
      </Text>
    </Box>
  )
}
