import { InputHTMLAttributes, HTMLAttributes } from "react";
import { SelectItems } from "../../entities/selectItems";

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
    label?: string | null
    defaultOption: string | null
    containerClass?: HTMLAttributes<HTMLDivElement>["className"]
    options: SelectItems[]
}

export function Select({
    label = null,
    containerClass = '',
    defaultOption ,
    options,
    ...rest
}: Props) {

    return (
        <div className={`flex flex-col gap-2 ${containerClass}`}>
            {label && <label htmlFor={rest.id} className="font-semibold">{label}</label>}
            <select 
                className='bg-zinc-900 py-3 px-4 rounded text-sm'
                defaultValue=""
                {...rest}
            >
                <option disabled value="">{defaultOption}</option>
                {options.map(option => <option value={option.value} key={option.value} >{option.label}</option>)}
            </select>
        </div>
    )
}