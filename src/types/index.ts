export interface BingoTheme {
  primaryColor: string
  headerColor: string
  leftPanelColor: string
  rightPanelColor: string
  textColor: string
  buttonColor: string
  backgroundImage: string | null
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
