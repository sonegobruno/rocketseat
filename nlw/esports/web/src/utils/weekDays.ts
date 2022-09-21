type WeekDays = {
    value: "0" | "1" | "2" | "3" | "4" | "5" | "6"
    title: "Domingo" | "Segunda" | "Terça"  | "Quarta" | "Quinta" | "Sexta"  | "Sábado"
    label: "D" | "S" | "T" | "Q" | "Q" | "S" | "S"
}

export const WEEK_DAYS: WeekDays[] = [
    { value: "0", title: "Domingo", label: "D" },
    { value: "1", title: "Segunda", label: "S" },
    { value: "2", title: "Terça", label: "T" },
    { value: "3", title: "Quarta", label: "Q" },
    { value: "4", title: "Quinta", label: "Q" },
    { value: "5", title: "Sexta", label: "S" },
    { value: "6", title: "Sábado", label: "S" },
]