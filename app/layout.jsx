import { Layout } from './client/Layout'
import './global.css'
import localFont from 'next/font/local'

const pixFont = localFont({ src: './PixeloidMono-d94EV.ttf' })

export const metadata = {
  title: '║8',
  description: `The Singularity`,
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={pixFont.className}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
