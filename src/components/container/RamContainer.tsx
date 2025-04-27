import React, { ReactNode } from 'react'

function RamContainer({ children }: {
    children: ReactNode,
}) {
    return (
        <div className=" md:w-full flex items-center justify-center ">
            <div className="w-full flex-wrap tablet:gap-y-[15px] gap-y-[10px] flex items-center tablet:justify-start justify-center">
                {children}
            </div></div>
    )
}

export default RamContainer