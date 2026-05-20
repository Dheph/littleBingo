import { useEffect } from 'react'
import { VStack, HStack, Text, Box } from '@chakra-ui/react'
import type { BingoTheme } from '../types'

const colorFields = [
  { key: 'headerColor', label: 'Cor do Header' },
  { key: 'leftPanelColor', label: 'Cor Lateral Esquerda' },
  { key: 'rightPanelColor', label: 'Cor Lateral Direita' },
  { key: 'primaryColor', label: 'Cor Principal' },
  { key: 'buttonColor', label: 'Cor do Botão' },
  { key: 'textColor', label: 'Cor do Texto' },
]

interface ThemeEditorProps {
  theme: BingoTheme
  imageFile?: File | null
  onChange: (theme: BingoTheme) => void
  onImageSelect?: (file: File) => void
  onImageRemove?: () => void
}

export default function ThemeEditor({ theme, imageFile, onChange, onImageSelect, onImageRemove }: ThemeEditorProps) {
  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : (theme.backgroundImage || null)

  useEffect(() => {
    const urlToRevoke = imageFile ? previewUrl : null
    return () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke)
    }
  }, [imageFile, previewUrl])

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

  return (
    <VStack gap={4} w="full" maxW="400px">
      <Box
        w="full"
        h="120px"
        borderRadius="lg"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg={theme.leftPanelColor}
        bgImage={previewUrl ? `url(${previewUrl})` : 'none'}
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
            Preview
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

      <VStack gap={2} w="full">
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

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDim = 800
        let w = img.width
        let h = img.height
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = (h / w) * maxDim
            w = maxDim
          } else {
            w = (w / h) * maxDim
            h = maxDim
          }
        }
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    }
    reader.readAsDataURL(file)
  })
}
