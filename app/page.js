import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div className='flex gap-2 spacing-y-4 text-white flex-col mx-auto items-center justify-center h-screen uppercase gap-7'>
      <Link href="/dashboard" className='font-bold text-4xl'>Go to dashboard Page</Link>
      <Link href="/login" className='font-bold text-4xl'>Go to login Page</Link>
    </div>
  )
}

export default Home