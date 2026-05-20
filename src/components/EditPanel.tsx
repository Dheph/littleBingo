import { useState } from 'react'
import { VStack, HStack, Input, Text, Button, Box } from '@chakra-ui/react'
import { useBingoStore } from '../store/bingoStore'
import ThemeEditor from './ThemeEditor'

export default function EditPanel() {
  const title = useBingoStore((s) => s.title)
  const totalNumbers = useBingoStore((s) => s.totalNumbers)
  const updateTitle = useBingoStore((s) => s.updateTitle)
  const updateTotalNumbers = useBingoStore((s) => s.updateTotalNumbers)
  const clearDrawn = useBingoStore((s) => s.clearDrawn)
  const addManualNumber = useBingoStore((s) => s.addManualNumber)
  const removeNumber = useBingoStore((s) => s.removeNumber)
  const drawnNumbers = useBingoStore((s) => s.drawnNumbers)
  const theme = useBingoStore((s) => s.theme)
  const updateTheme = useBingoStore((s) => s.updateTheme)

  const [manualNum, setManualNum] = useState('')

  function handleAddManual() {
    const num = parseInt(manualNum)
    if (!isNaN(num)) {
      addManualNumber(num)
      setManualNum('')
    }
  }

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2} opacity={0.8}>
          Título
        </Text>
        <Input
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          bg="whiteAlpha.100"
          borderColor="whiteAlpha.200"
          color={theme.textColor}
          size="sm"
        />
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2} opacity={0.8}>
          Quantidade de Números
        </Text>
        <Input
          type="number"
          value={totalNumbers}
          onChange={(e) => updateTotalNumbers(parseInt(e.target.value) || 1)}
          bg="whiteAlpha.100"
          borderColor="whiteAlpha.200"
          color={theme.textColor}
          size="sm"
        />
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2} opacity={0.8}>
          Adicionar Número Manualmente
        </Text>
        <HStack gap={2}>
          <Input
            type="number"
            value={manualNum}
            onChange={(e) => setManualNum(e.target.value)}
            placeholder="Número"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.200"
            color={theme.textColor}
            size="sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddManual()}
          />
          <Button size="sm" bg={theme.buttonColor} color="white" onClick={handleAddManual}>
            Adicionar
          </Button>
        </HStack>
      </Box>

      {drawnNumbers.length > 0 && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={2} opacity={0.8}>
            Remover Número Sorteado
          </Text>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {drawnNumbers.map((num) => (
              <Button
                key={num}
                size="xs"
                variant="outline"
                borderColor="whiteAlpha.300"
                color={theme.textColor}
                onClick={() => removeNumber(num)}
                _hover={{ bg: 'red.500', borderColor: 'red.500' }}
              >
                {num}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      <Button
        size="sm"
        variant="outline"
        borderColor="orange.500"
        color="orange.400"
        onClick={clearDrawn}
        _hover={{ bg: 'orange.500', color: 'white' }}
      >
        Limpar Todos os Sorteados
      </Button>

      <Box borderTop="1px solid" borderColor="whiteAlpha.200" pt={4}>
        <Text fontSize="sm" fontWeight="semibold" mb={4} opacity={0.8}>
          Tema
        </Text>
        <ThemeEditor theme={theme} onChange={updateTheme} />
      </Box>
    </VStack>
  )
}
