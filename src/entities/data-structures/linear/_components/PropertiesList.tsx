import { useMemo } from 'react'

import { Primitive } from '@/types'
import Properties from '@/components/app/Properties'
import List from '../_classes/List'

export default function PropertiesList({ list, trigger }: {

    list: List,
    trigger: any[]
}) {

    const setProperties = useMemo(() => {
        return {
            'size': list.size + '',
            'isEmpty': list.isEmpty.toString(),
            'isFull': list.isFull.toString(),
            [`${list.name} size`]: list.maxSize + '',
        }

    }, trigger);

    return (

        <Properties properties={setProperties} />
    )
}
