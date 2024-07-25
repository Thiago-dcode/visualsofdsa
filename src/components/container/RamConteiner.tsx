import React, { ReactNode } from 'react'

function RamConteiner({ children }: {
    children: ReactNode
}) {
    return (
        <div className="md:w-full flex items-center justify-center">
            <div className="w-full  flex-wrap gap-y-4 flex items-center justify-start">
                {children}
            </div></div>
    )
}

export default RamConteiner