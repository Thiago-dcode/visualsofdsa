import { Input } from '@/components/ui/input';
import ButtonAction from './ButtonAction';
import { cn } from '@/lib/utils';

function ButtonWithInput({ data, setData, isLoading, onClick, title = "push", className = '' }: {
  data: string,
  setData: (e: string) => void,
  isLoading: boolean,
  onClick: () => void
  title?: string,
  className?: string
}) {
  return (

    <div className="flex max-w-sm items-center space-x-2">
      <Input defaultValue={data} placeholder="let x = 50" className="text-black" onChange={(e) => {
        setData(e.target.value)
      }} type="text" name="" id="" />
      <ButtonAction onClick={onClick} isLoading={isLoading} className={cn('bg-green-400 hover:bg-green-600', className)} title={title} />
    </div>
  )
}

export default ButtonWithInput