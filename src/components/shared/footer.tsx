import { Mail, MapPin, PhoneCall } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Logo from './logo'

export default function Footer() {
  return (
    <div className='inset-0 bg-secondary'>
      <div className='container'>
        <div className='grid grid-cols-1 py-8 max-md:gap-y-8 md:grid-cols-4'>
          <div className='space-y-4 md:col-span-2 md:pr-32'>
            <Logo />
            <div>
              Eresidence presents maintenance request tracking, event scheduling, billing, and
              facility booking, residence fosters a connected community and enhances operational
              efficiency.
            </div>
          </div>
          <div className='space-y-6 pb-4'>
            <div className='text-xl font-semibold'>Founders</div>
            <div className='space-y-4 '>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src='https://firebasestorage.googleapis.com/v0/b/eresidence-b1d20.appspot.com/o/eresidence%2Fuser%2F908d15d5-46c6-4e7d-a54e-672345777913?alt=media&token=0d58d08a-ddf5-4604-bdfa-587debbf3b45' />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    O
                  </AvatarFallback>
                </Avatar>
                <div className='text-sm'>
                  <div className='flex items-center justify-between'>
                    <div>@otabek</div>
                    <div className='text-xs'>+998943686265</div>
                  </div>
                  <div className='text-muted-foreground'>tulaganovok04@gmail.com</div>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Avatar>
                  <AvatarImage src='/islombek.png' />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    I
                  </AvatarFallback>
                </Avatar>
                <div className='text-sm'>
                  <div className='flex items-center justify-between'>
                    <div>@islombek</div>
                    <div className='pl-8 text-xs'>+998975450428</div>
                  </div>
                  <div className='text-muted-foreground'>nexiar280hp@gmail.com</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    S
                  </AvatarFallback>
                </Avatar>
                <div className='text-sm'>
                  <div className='flex items-center justify-between'>
                    <div>@samandar</div>
                    <div className='text-xs'>+998901234567</div>
                  </div>
                  <div className='text-muted-foreground'>samandarkhamraev@gmail.com</div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    A
                  </AvatarFallback>
                </Avatar>
                <div className='text-sm'>
                  <div className='flex items-center justify-between'>
                    <div>@azizbek</div>
                    <div className='text-xs'>+998901234567</div>
                  </div>
                  <div className='text-muted-foreground'>azizbekkhushanaev@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-6 pb-4'>
            <div className='text-xl font-semibold'>Contacts</div>
            <div className='space-y-4'>
              <div className='flex flex-col space-y-3'>
                <div className='flex items-center space-x-3'>
                  <PhoneCall size={20} />
                  <div className='flex flex-col space-y-1'>
                    <a
                      className='text-sm hover:text-purple-500 hover:underline dark:hover:text-purple-300'
                      href='tel:+998900000000'
                    >
                      +998 (94) 368-62-65
                    </a>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <Mail size={20} />
                  <a
                    className='text-sm hover:text-purple-500 hover:underline dark:hover:text-purple-300'
                    href='mailto:info@sammi.ac'
                  >
                    tulaganovok04@gmail.com
                  </a>
                </div>
                <div className='flex items-center space-x-3'>
                  <MapPin size={20} />
                  <span className='text-sm'>Tashkent, Uzbekistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full border-t border-muted-foreground py-4 text-center'>
          &copy; Eresidence {new Date().getFullYear()} | All rights reserved
        </div>
      </div>
    </div>
  )
}
