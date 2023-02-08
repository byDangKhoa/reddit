import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'verdana';
        src: url('/fonts/verdana/verdana.ttf');
        font-style: normal;
        font-weight: 400;
        font-display: swap;
       
      }
      @font-face {
        font-family: 'verdana-bold';
        src: url('/fonts/verdana/verdana-bold.ttf');
        font-style: normal;
        font-weight: 700;
        font-display: swap;
      
      `}
  />
)

export default Fonts
