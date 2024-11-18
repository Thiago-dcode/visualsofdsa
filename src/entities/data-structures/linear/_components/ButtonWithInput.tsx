import { Input } from '@/components/ui/input';
import ButtonAction from './ButtonAction';
import { cn } from '@/lib/utils';
import { ButtonActionType } from '@/types';

function ButtonWithInput({ data, setData, isLoading, onClick, title = "push", className = '',action }: {
  data: string,
  setData: (e: string) => void,
  isLoading: boolean,
  onClick: () => void
  title?: string,
  className?: string,
  action: ButtonActionType
}) {
  return (

    <div className="flex max-w-sm items-center space-x-2">
      <Input defaultValue={data} placeholder="let x = 50"  onChange={(e) => {
        setData(e.target.value)
      }} type="text" name="" id="" />
      <ButtonAction action={action} onClick={onClick} isLoading={isLoading} className={cn('bg-green-400 hover:bg-green-600', className)} title={title} />
    </div>
  )
}

export default ButtonWithInput