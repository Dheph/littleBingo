import { Box, Text, Button } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

const MotionBox = motion(Box)

interface BingoOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function BingoOverlay({ isOpen, onClose }: BingoOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          position="fixed"
          inset={0}
          bg="blackAlpha.800"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          onClick={onClose}
        >
          <MotionBox
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            textAlign="center"
          >
            <Text
              fontSize="8xl"
              fontWeight="black"
              color="yellow.300"
              textShadow="0 0 40px rgba(253, 224, 71, 0.5)"
              lineHeight={1}
            >
              BINGO!
            </Text>
            <Button
              mt={8}
              size="lg"
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: 'whiteAlpha.300' }}
              onClick={onClose}
            >
              Fechar
            </Button>
          </MotionBox>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
