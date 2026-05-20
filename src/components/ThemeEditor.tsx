import { useEffect, useState } from 'react'
import { VStack, HStack, Text, Box, Select, Button, ButtonGroup, createListCollection } from '@chakra-ui/react'
import type { BingoTheme } from '../types'
import { compressImage } from '../utils/compress'

const colorFields = [
  { key: 'headerColor', label: 'Cor do Header' },
  { key: 'leftPanelColor', label: 'Cor Lateral Esquerda' },
  { key: 'rightPanelColor', label: 'Cor Lateral Direita' },
  { key: 'primaryColor', label: 'Cor Principal' },
  { key: 'buttonColor', label: 'Cor do Botão' },
  { key: 'textColor', label: 'Cor do Texto' },
]

const directionCollection = createListCollection({
  items: [
    { value: 'to bottom', label: 'Vertical ↓' },
    { value: 'to right', label: 'Horizontal →' },
    { value: '135deg', label: 'Diagonal ↖' },
  ],
})

interface ThemeEditorProps {
  theme: BingoTheme
  imageFile?: File | null
  onChange: (theme: BingoTheme) => void
  onImageSelect?: (file: File) => void
  onImageRemove?: () => void
}

export default function ThemeEditor({ theme, imageFile, onChange, onImageSelect, onImageRemove }: ThemeEditorProps) {
  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : (theme.backgroundImage || null)
  const [imageDimensions, setImageDimensions] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const urlToRevoke = imageFile ? previewUrl : null
    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke)
    }
  }, [imageFile, previewUrl])

  useEffect(() => {
    if (!previewUrl) return
    const img = new Image()
    img.onload = () => setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = previewUrl
  }, [previewUrl])

  const hasGradient = !!theme.backgroundGradient
  const hasImage = !!previewUrl

  function handleColorChange(key: string, value: string) {
    onChange({ ...theme, [key]: value })
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (onImageSelect) {
      onImageSelect(file)
    } else {
      compressImage(file).then((base64) => {
        onChange({ ...theme, backgroundImage: base64 })
      })
    }
  }

  function handleRemoveImage() {
    if (onImageRemove) {
      onImageRemove()
    } else {
      onChange({ ...theme, backgroundImage: null })
    }
  }

  function toggleGradient(on: boolean) {
    if (on) {
      const bg = `linear-gradient(${theme.gradientDirection}, ${theme.gradientFrom}, ${theme.gradientTo})`
      onChange({ ...theme, backgroundGradient: bg })
    } else {
      onChange({ ...theme, backgroundGradient: null })
    }
  }

  function updateGradientParam(param: 'gradientFrom' | 'gradientTo' | 'gradientDirection', value: string) {
    const next = { ...theme, [param]: value }
    const dir = param === 'gradientDirection' ? value : next.gradientDirection
    const from = param === 'gradientFrom' ? value : next.gradientFrom
    const to = param === 'gradientTo' ? value : next.gradientTo
    next.backgroundGradient = `linear-gradient(${dir}, ${from}, ${to})`
    onChange(next)
  }

  function getPreviewBackground(): React.CSSProperties {
    if (hasImage) {
      return {
        background: `url(${previewUrl}) center / cover no-repeat`,
      }
    }
    if (hasGradient) {
      return { background: theme.backgroundGradient! }
    }
    return { background: theme.leftPanelColor }
  }

  function aspectRatioLabel(): string {
    if (!imageDimensions) return ''
    const { w, h } = imageDimensions
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const g = gcd(w, h)
    return `${w}×${h} px (${w / g}:${h / g})`
  }

  return (
    <VStack gap={4} w="full" maxW="400px">
      <Box
        w="full"
        h="140px"
        borderRadius="lg"
        border="1px solid"
        borderColor="whiteAlpha.300"
        position="relative"
        overflow="hidden"
        style={getPreviewBackground()}
      >
        <Box
          h="24px"
          bg={theme.headerColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" color={theme.textColor}>
            Preview
          </Text>
        </Box>
        <Box display="flex" h="calc(100% - 24px)">
          <Box flex={2} display="flex" alignItems="center" justifyContent="center" bg={hasImage || hasGradient ? undefined : theme.leftPanelColor}>
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
            <input
              type="color"
              value={theme[key as keyof BingoTheme] as string}
              onChange={(e) => handleColorChange(key, e.target.value)}
              style={{
                width: '50px',
                height: '36px',
                padding: '2px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                background: 'transparent',
              }}
            />
            <Text fontSize="xs" fontFamily="mono" opacity={0.6}>
              {theme[key as keyof BingoTheme] as string}
            </Text>
          </HStack>
        </HStack>
      ))}

      <Box w="full" pt={2} borderTop="1px solid" borderColor="whiteAlpha.200">
        <Text fontSize="sm" opacity={0.8} mb={3}>
          Gradiente de Fundo
        </Text>
        <ButtonGroup size="sm" w="full" mb={3}>
          <Button
            flex={1}
            variant={!hasGradient ? 'solid' : 'outline'}
            bg={!hasGradient ? theme.buttonColor : undefined}
            color={!hasGradient ? 'white' : theme.textColor}
            borderColor="whiteAlpha.300"
            onClick={() => toggleGradient(false)}
            _hover={{}}
          >
            Cor Sólida
          </Button>
          <Button
            flex={1}
            variant={hasGradient ? 'solid' : 'outline'}
            bg={hasGradient ? theme.buttonColor : undefined}
            color={hasGradient ? 'white' : theme.textColor}
            borderColor="whiteAlpha.300"
            onClick={() => toggleGradient(true)}
            _hover={{}}
          >
            Gradiente
          </Button>
        </ButtonGroup>

        {hasGradient && (
          <VStack gap={3} w="full">
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" opacity={0.8}>Cor Inicial</Text>
              <HStack gap={2}>
                <input
                  type="color"
                  value={theme.gradientFrom}
                  onChange={(e) => updateGradientParam('gradientFrom', e.target.value)}
                  style={{
                    width: '50px',
                    height: '36px',
                    padding: '2px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    background: 'transparent',
                  }}
                />
                <Text fontSize="xs" fontFamily="mono" opacity={0.6}>{theme.gradientFrom}</Text>
              </HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" opacity={0.8}>Cor Final</Text>
              <HStack gap={2}>
                <input
                  type="color"
                  value={theme.gradientTo}
                  onChange={(e) => updateGradientParam('gradientTo', e.target.value)}
                  style={{
                    width: '50px',
                    height: '36px',
                    padding: '2px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    background: 'transparent',
                  }}
                />
                <Text fontSize="xs" fontFamily="mono" opacity={0.6}>{theme.gradientTo}</Text>
              </HStack>
            </HStack>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" opacity={0.8}>Direção</Text>
              <Box w="140px">
                <Select.Root
                  size="sm"
                  collection={directionCollection}
                  value={[theme.gradientDirection]}
                  onValueChange={(e) => updateGradientParam('gradientDirection', e.value[0])}
                >
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.Content>
                    {directionCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </HStack>
          </VStack>
        )}
      </Box>

      <VStack gap={2} w="full" pt={2} borderTop="1px solid" borderColor="whiteAlpha.200">
        <Text fontSize="sm" opacity={0.8}>
          Imagem de Fundo
        </Text>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            color: theme.textColor,
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
        <Text fontSize="xs" opacity={0.5} textAlign="center">
          Recomendado: proporção vertical (ex: 3:4 ou 9:16)
        </Text>
        {imageDimensions && (
          <Text fontSize="xs" opacity={0.5}>
            {aspectRatioLabel()}
          </Text>
        )}
        {previewUrl && (
          <Text
            fontSize="xs"
            opacity={0.6}
            cursor="pointer"
            onClick={handleRemoveImage}
            _hover={{ opacity: 1 }}
          >
            Remover imagem
          </Text>
        )}
      </VStack>
    </VStack>
  )
}
