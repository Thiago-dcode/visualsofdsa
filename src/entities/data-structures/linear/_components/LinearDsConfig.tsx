import { Input } from '@/components/ui/input'
import { Primitive } from '@/types';
import LinearDs from '../_classes/LinearDs';

export default function LinearDsConfig({
    stack,
    render
}: {
    stack: LinearDs<Primitive>;
    render: (c?: boolean) => void
}) {
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div>
                <label htmlFor="size">Size</label>
                <Input defaultValue={stack.maxSize} onChange={(e) => {
                    stack.maxSize = parseInt(e.target.value)
                    render(true)
                }} name='size' type='range' min={1} max={30} />
            </div>
            <div>
                <label htmlFor="width">Width</label>
                <Input defaultValue={stack.width} onChange={(e) => {
                    stack.width = parseInt(e.target.value)
                    render()
                }} name='width' type='range' min={200} max={600} />
            </div>
            <div>
                <label htmlFor="speed">Speed</label>
                <Input defaultChecked defaultValue={stack.speed} onChange={(e) => {
                    const speed = parseInt(e.target.value)
                    if (speed == 1 || speed == 2 || speed == 3) {
                        stack.speed = speed
                        // render()
                    }
                }} name='speed' type='range' min={1} max={3} />
            </div>
        </div>
    )
}
