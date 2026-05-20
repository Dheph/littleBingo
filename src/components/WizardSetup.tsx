import { useState } from 'react'
import { Box, Text, Input, Button, VStack, HStack, Flex, Heading } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBingoStore } from '../store/bingoStore'
import { useNavigate } from 'react-router-dom'
import ThemeEditor from './ThemeEditor'
import { compressImage } from '../utils/compress'
import type { BingoTheme } from '../types'

const MotionBox = motion(Box)

const defaultWizardTheme: BingoTheme = {
  primaryColor: '#6366f1',
  headerColor: '#1e1b4b',
  leftPanelColor: '#0f172a',
  rightPanelColor: '#1e293b',
  textColor: '#f8fafc',
  buttonColor: '#818cf8',
  backgroundImage: null,
  backgroundGradient: null,
  gradientFrom: '#0f172a',
  gradientTo: '#1e1b4b',
  gradientDirection: 'to bottom',
}

const steps = [
  { question: 'Quantos números terão no bingo?', placeholder: '75', type: 'number' as const },
  { question: 'Qual o nome do seu bingo?', placeholder: 'Meu Bingo', type: 'text' as const },
  { question: 'Personalize o visual', placeholder: '', type: 'theme' as const },
  { question: 'Tudo pronto!', placeholder: '', type: 'start' as const },
]

export default function WizardSetup() {
  const [currentStep, setCurrentStep] = useState(0)
  const [totalNumbers, setTotalNumbers] = useState(75)
  const [title, setTitle] = useState('')
  const [wizardTheme, setWizardTheme] = useState<BingoTheme>(defaultWizardTheme)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const navigate = useNavigate()
  const setup = useBingoStore((s) => s.setup)

  const handleNext = async () => {
    if (currentStep === 0 && totalNumbers < 1) return
    if (currentStep === 1 && !title.trim()) return
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      const finalTheme = { ...wizardTheme }
      if (imageFile) {
        finalTheme.backgroundImage = await compressImage(imageFile)
      }
      setup(title.trim(), totalNumbers, finalTheme)
      navigate('/bingo')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={wizardTheme.leftPanelColor}
      color={wizardTheme.textColor}
      p={8}
    >
      <AnimatePresence mode="wait">
        <MotionBox
          key={currentStep}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          w="full"
          maxW="500px"
          textAlign="center"
        >
          <Heading size="lg" mb={2}>
            littleBingo
          </Heading>
          <Text fontSize="sm" opacity={0.6} mb={12}>
            Etapa {currentStep + 1} de {steps.length}
          </Text>

          <VStack gap={8}>
            <Text fontSize="2xl" fontWeight="bold">
              {steps[currentStep].question}
            </Text>

            {currentStep === 0 && (
              <Input
                type="number"
                value={totalNumbers}
                onChange={(e) => setTotalNumbers(parseInt(e.target.value) || 1)}
                size="xl"
                textAlign="center"
                fontSize="3xl"
                maxW="200px"
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.300"
                _focus={{ borderColor: wizardTheme.buttonColor }}
              />
            )}

            {currentStep === 1 && (
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={steps[1].placeholder}
                size="xl"
                textAlign="center"
                fontSize="2xl"
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.300"
                _focus={{ borderColor: wizardTheme.buttonColor }}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            )}

            {currentStep === 2 && (
              <ThemeEditor
                theme={wizardTheme}
                imageFile={imageFile}
                onChange={setWizardTheme}
                onImageSelect={setImageFile}
                onImageRemove={() => setImageFile(null)}
              />
            )}

            {currentStep === 3 && (
              <VStack gap={4}>
                <Text fontSize="lg" opacity={0.8}>
                  {title} • {totalNumbers} números
                </Text>
              </VStack>
            )}

            <HStack gap={4} mt={4}>
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="lg"
                  borderColor="whiteAlpha.300"
                  color={wizardTheme.textColor}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="lg"
                bg={wizardTheme.buttonColor}
                color="white"
                _hover={{ opacity: 0.9 }}
                disabled={
                  (currentStep === 0 && totalNumbers < 1) ||
                  (currentStep === 1 && !title.trim())
                }
              >
                {currentStep === steps.length - 1 ? 'Começar Bingo' : 'Continuar'}
              </Button>
            </HStack>
          </VStack>
        </MotionBox>
      </AnimatePresence>
    </Flex>
  )
}
