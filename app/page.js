import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <div className='flex gap-2 spacing-y-4'>
      <Link href="/dashboard">Go to dashboard Page</Link>
      <Link href="/login">Go to login Page</Link>
    </div>
  )
}

export default Home