export function dateFormat(value: string) {
    return Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    }).format(new Date(value))
}