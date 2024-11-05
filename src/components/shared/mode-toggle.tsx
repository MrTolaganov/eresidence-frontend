import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../providers/theme.provider'
import { Button } from '../ui/button'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant={'ghost'} size={'icon'} asChild className='cursor-pointer'>
      {theme === 'light' ? (
        <Moon className='size-6' onClick={() => setTheme('dark')} />
      ) : (
        <Sun className='size-6' onClick={() => setTheme('light')} />
      )}
    </Button>
  )
}
