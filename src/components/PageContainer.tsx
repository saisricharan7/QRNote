import React from 'react'

type Props ={
    children: React.ReactNode
}


const PageContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 ">
        {children}
      </div>
    </div>
  )
}

export default PageContainer