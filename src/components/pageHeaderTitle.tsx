import React, { ReactNode } from 'react'
import Title from './ui/Title'
import dynamic from 'next/dynamic'
type Props = {
    title: string,
    info: ReactNode
}
function PageHeaderTitle({ title, info }: Props) {

    const Info = dynamic(() => import('@/components/ui/info'), {
        ssr: true,
        loading: () => <div className='bg-red-700'>loading</div>
    });


    return (
        <div className='flex items-center justify-center gap-2'>
            <Title title={title} />
            <Info title={title} text={info} />
        </div>
    )
}

export default PageHeaderTitle