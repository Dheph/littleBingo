import { Box, Flex, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useBingoStore } from '../store/bingoStore'

export default function LandingPage() {
  const navigate = useNavigate()
  const isSetup = useBingoStore((s) => s.isSetup)

  function handleStart() {
    if (isSetup) {
      navigate('/bingo')
    } else {
      navigate('/setup')
    }
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="#0f172a"
      color="#f8fafc"
      p={8}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="500px"
        h="500px"
        bg="radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)"
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-20%"
        right="-10%"
        w="500px"
        h="500px"
        bg="radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)"
        borderRadius="full"
        pointerEvents="none"
      />

      <VStack gap={8} textAlign="center" position="relative" zIndex={1}>
        <Text
          fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
          fontWeight="900"
          letterSpacing="-0.03em"
          lineHeight={1.15}
          bgGradient="to-r"
          gradientFrom="#818cf8"
          gradientTo="#6366f1"
          bgClip="text"
          pb={2}
        >
          littleBingo
        </Text>

        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          opacity={0.5}
          maxW="400px"
          fontWeight="300"
        >
          Seu bingo online em 1 minuto
        </Text>

        <Button
          size="xl"
          bg="#6366f1"
          color="white"
          fontSize="lg"
          fontWeight="bold"
          px={12}
          py={8}
          borderRadius="full"
          _hover={{ bg: '#4f46e5', transform: 'scale(1.05)' }}
          _active={{ transform: 'scale(0.98)' }}
          onClick={handleStart}
          transition="all 0.2s"
        >
          {isSetup ? 'Continuar Bingo' : 'Começar'}
        </Button>

        {isSetup && (
          <Text fontSize="sm" opacity={0.3}>
            ou crie um novo bingo no menu
          </Text>
        )}
      </VStack>
    </Flex>
  )
}
