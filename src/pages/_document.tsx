import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        {/* <Script
          type='text/javascript'
          src='/public/static/fbscript.js'></Script> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
