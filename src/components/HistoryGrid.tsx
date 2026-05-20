import { Box, Text, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useBingoStore } from '../store/bingoStore'

const MotionBox = motion(Box)

export default function HistoryGrid() {
  const drawnNumbers = useBingoStore((s) => s.drawnNumbers)
  const theme = useBingoStore((s) => s.theme)

  if (drawnNumbers.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Text opacity={0.4} fontSize="sm">
          Nenhum número sorteado ainda
        </Text>
      </Box>
    )
  }

  return (
    <SimpleGrid columns={4} gap={2}>
      {drawnNumbers.map((num, index) => (
        <MotionBox
          key={num}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 * Math.min(index, 10) }}
          w="full"
          aspectRatio="1"
          borderRadius="md"
          bg={index === drawnNumbers.length - 1 ? theme.buttonColor : 'whiteAlpha.100'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight={index === drawnNumbers.length - 1 ? 'bold' : 'normal'}
        >
          <Text fontSize="sm" color={theme.textColor}>
            {num}
          </Text>
        </MotionBox>
      ))}
    </SimpleGrid>
  )
}
