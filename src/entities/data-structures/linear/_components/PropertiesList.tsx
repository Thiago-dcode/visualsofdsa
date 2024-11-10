import { useMemo } from 'react'

import { Primitive } from '@/types'
import Properties, { PropertiesType } from '@/components/app/Properties'
import List from '../_classes/List'

export default function PropertiesList({ list, trigger }: {

    list: List,
    trigger: any[]
}) {

    const setProperties: PropertiesType = useMemo(() => {
        return {
            'size': {
                value: list.size + '',
            },
            'isEmpty': {
                value: list.isEmpty.toString()
            },
            'isFull': {
                value: list.isFull.toString()
            },
            [`${list.name} size`]: {
                value: list.maxSize + ''
            },
        }

    }, trigger);

    return (

        <Properties properties={setProperties} />
    )
}
