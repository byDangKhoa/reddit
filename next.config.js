/** @type {import('next').NextConfig} */
// const redirects = {
//   async redirects() {
//     return [
//       {
//         source: '/r',
//         destination: '/',
//         permanent: true,
//       },
//       // {
//       //   source: '/learning',
//       //   has: [
//       //     {
//       //       type: 'query',
//       //       key: 'learning',
//       //     },
//       //   ],
//       //   destination: '/learning?select=drawing',
//       //   permanent: false,
//       // },
//       // {
//       //   source: '/policy',
//       //   destination: '/policy/terms-and-conditions',
//       //   permanent: false,
//       // },
//     ]
//   },
// }
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
// module.exports = redirects
