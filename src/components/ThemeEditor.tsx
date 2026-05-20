import { VStack, HStack, Text, Input, Box } from '@chakra-ui/react'
import { useBingoStore } from '../store/bingoStore'

const colorFields = [
  { key: 'headerColor', label: 'Cor do Header' },
  { key: 'leftPanelColor', label: 'Cor Lateral Esquerda' },
  { key: 'rightPanelColor', label: 'Cor Lateral Direita' },
  { key: 'primaryColor', label: 'Cor Principal' },
  { key: 'buttonColor', label: 'Cor do Botão' },
  { key: 'textColor', label: 'Cor do Texto' },
]

export default function ThemeEditor() {
  const theme = useBingoStore((s) => s.theme)
  const updateTheme = useBingoStore((s) => s.updateTheme)

  function handleColorChange(key: string, value: string) {
    updateTheme({ [key]: value })
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateTheme({ backgroundImage: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <VStack gap={4} w="full" maxW="400px">
      <Box
        w="full"
        h="120px"
        borderRadius="lg"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg={theme.leftPanelColor}
        bgImage={theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none'}
        bgSize="cover"
        backgroundPosition="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          h="24px"
          bg={theme.headerColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" color={theme.textColor}>
            Preview Header
          </Text>
        </Box>
        <Box display="flex" h="calc(100% - 24px)">
          <Box flex={2} bg={theme.leftPanelColor} display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="2xl" fontWeight="bold" color={theme.textColor}>
              42
            </Text>
          </Box>
          <Box flex={1} bg={theme.rightPanelColor} p={2}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {[7, 14, 23, 38, 42, 55].map((n) => (
                <Box
                  key={n}
                  w="18px"
                  h="18px"
                  borderRadius="sm"
                  bg={n === 42 ? theme.buttonColor : 'whiteAlpha.200'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="8px" color={theme.textColor}>
                    {n}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {colorFields.map(({ key, label }) => (
        <HStack key={key} w="full" justify="space-between">
          <Text fontSize="sm" opacity={0.8}>
            {label}
          </Text>
          <HStack gap={2}>
            <Input
              type="color"
              value={(theme as unknown as Record<string, string>)[key]}
              onChange={(e) => handleColorChange(key, e.target.value)}
              w="50px"
              h="36px"
              p={1}
              cursor="pointer"
            />
            <Text fontSize="xs" fontFamily="mono" opacity={0.6}>
              {(theme as unknown as Record<string, string>)[key]}
            </Text>
          </HStack>
        </HStack>
      ))}

      <VStack gap={2} w="full">
        <Text fontSize="sm" opacity={0.8}>
          Imagem de Fundo
        </Text>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          size="sm"
          color={theme.textColor}
          borderColor="whiteAlpha.300"
          _hover={{ borderColor: 'whiteAlpha.500' }}
        />
        {theme.backgroundImage && (
          <Text
            fontSize="xs"
            opacity={0.6}
            cursor="pointer"
            onClick={() => updateTheme({ backgroundImage: null })}
            _hover={{ opacity: 1 }}
          >
            Remover imagem
          </Text>
        )}
      </VStack>
    </VStack>
  )
}
