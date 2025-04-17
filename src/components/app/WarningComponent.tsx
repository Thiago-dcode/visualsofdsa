import React from 'react'
import { Button } from '../ui/button'
import { PopOverComponent } from '../ui/PopOverComponent'
import { TriangleAlert } from 'lucide-react'
type WarningComponentProps = {
    title: string;
  
    warning:{
        message:string;
        warnings?:string[];
    }
    solution?:{
        message:string;
        solutions?:string[];
    }
  
}
function WarningComponent({title, warning, solution}: WarningComponentProps) {
  return (
    <PopOverComponent trigger={<Button variant={'ghost'} className="hover:bg-red-50"><TriangleAlert className='text-app-bauhaus-red w-6 h-6'/></Button>} content={<div className="p-4 max-w-xs">
        <h3 className="font-bold text-lg text-app-bauhaus-red mb-2">⚠️ {title}</h3>
        <p className="text-gray-700">{warning.message}</p>
        <ul className="list-disc list-inside mt-2 text-gray-600">
          {warning.warnings?.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      { solution && <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-700">✨ {solution.message}</p>
         {solution.solutions && <ul className="list-disc list-inside mt-2 text-gray-600">
            {solution.solutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ul>}
        </div>}
      </div>} />  
  )
}

export default WarningComponent
