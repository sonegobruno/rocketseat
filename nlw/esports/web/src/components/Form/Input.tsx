import { InputHTMLAttributes, HTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string | null
    containerClass?: HTMLAttributes<HTMLDivElement>["className"]
}

export function Input({
    label = null,
    containerClass = '',
    ...rest
}: Props) {
    return (
        <div className={`flex flex-col gap-2 ${containerClass}`}>
            {label && <label htmlFor={rest.id} className="font-semibold">{label}</label>}
            <input 
                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
                {...rest}
            />
        </div>
    )
}