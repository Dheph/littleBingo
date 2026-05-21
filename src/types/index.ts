export interface BingoTheme {
  primaryColor: string
  headerColor: string
  leftPanelColor: string
  rightPanelColor: string
  textColor: string
  buttonColor: string
  bingoButtonColor: string
  bingoButtonText: string
  backgroundImage: string | null
  backgroundGradient: string | null
  gradientFrom: string
  gradientTo: string
  gradientDirection: string
}

export interface BingoState {
  isSetup: boolean
  title: string
  totalNumbers: number
  drawnNumbers: number[]
  currentNumber: number | null
  theme: BingoTheme
  lastUpdated: number
}
