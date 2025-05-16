import { Inter } from 'next/font/google'
import  {Lusitana} from 'next/font/google'
import { Poppins } from 'next/font/google'
// import { Auromiya } from 'next/font/local'

const lusitana = Lusitana({
    weight: '400',
    subsets: ['latin'],
    })

const inter = Inter({
  weight: '400',
  subsets: ['latin'],
})

//font poppins
const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

 
// const auromiya = Auromiya({
//   weight: '400',
//   subsets: ['latin'],
// })

export { inter , lusitana, poppins }