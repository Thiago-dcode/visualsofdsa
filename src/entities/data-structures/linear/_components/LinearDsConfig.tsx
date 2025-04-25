import { Input } from '@/components/ui/input'
import { Primitive, speed } from '@/types';
import LinearDs from '../_classes/LinearDs';
import SpeedComponent from '@/components/app/speedComponent';
import useResponsive from '@/hooks/useResponsive';
const MAX_WIDTH = 600
export default function LinearDsConfig({
    stack,
    maxWidth,
    config,
    setConfig
}: {
    stack: LinearDs<Primitive>;
    maxWidth: number;
    config: {
        maxSize: number;
        width: number;
        speed: speed;
    };
    setConfig: (key: keyof typeof config, value: number) => void;
}) {


    return (
        <div className='flex flex-col items-center justify-center gap-4 '>
            <div>
                <label htmlFor="size">Size</label>
                <Input defaultValue={stack.maxSize} onChange={(e) => {
                    stack.maxSize = parseInt(e.target.value)
                    setConfig('maxSize', parseInt(e.target.value))
                }} name='size' type='range' min={1} max={30} />
            </div>
            <div >
                <label htmlFor="width">Width</label>
                <Input defaultValue={stack.width} onChange={(e) => {
                    stack.width = parseInt(e.target.value)
                    setConfig('width', parseInt(e.target.value))
                }} name='width' type='range' min={maxWidth < 200 ? maxWidth : 200} max={maxWidth} />
            </div>
            <SpeedComponent speed={config.speed} setSpeed={(speed) => setConfig('speed', speed)} />
        </div>
    )
}
