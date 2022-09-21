import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Check, GameController } from 'phosphor-react'
import { Input } from '../components/Form/Input'
import { Select } from './Form/Select';
import { Game } from '../entities/game/game'
import { formatGameToSelectItems } from '../mapperts/game';
import { FormEvent, useCallback, useState } from 'react';
import { WEEK_DAYS } from '../utils/weekDays';
import axios from 'axios'

interface Props {
    games: Game[]
}

export function CreateAdModal({ games}: Props) {
    const [ weekDays, setWeekdDays] = useState<string[]>([])
    const [ useVoiceChannel, setUseVoiceChannel] = useState(false)

    const handleCreateAd = useCallback(async (event: FormEvent) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)

        if(data.name === '') {
            return 
        }

        try {
            await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel,
                weekDays
            })
            alert('Anúncio criado com sucesso')
        } catch(err) {
            console.error(err)
            alert('Erro ao criar anúncio')
        }

    }, [useVoiceChannel, weekDays])

   return (
        <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed">
        <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-black/25">
            <Dialog.Title className='text-3xl font-black'>Publique um anúncio</Dialog.Title>
            <form onSubmit={handleCreateAd} className='mt-6 flex flex-col gap-2'>
                <Select label="Qual o game?" id="game" name="game" defaultOption="Selecione o game que deseja jogar" options={formatGameToSelectItems(games)}/>
                <Input  label="Seu nome (ou nickname)" id="name" name="name" placeholder="Como te chamam dentro do game?" />
                <div className="grid grid-cols-2 gap-6">
                <Input  label="Joga a quantos anos?" type="number" name="yearsPlaying"  id="yearsPlaying" placeholder="Tudo bem ser ZERO" />
                <Input  label="Qual seu Discord?" id="discord" name="discord" placeholder="Usuario#0000" />
                </div>

                <div className='flex gap-6'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="weekDays">Quando costuma jogar?</label>
                    <ToggleGroup.Root 
                        type="multiple" 
                        className='grid grid-cols-4 gap-2'
                        onValueChange={setWeekdDays}
                        value={weekDays}
                    >
                        {WEEK_DAYS.map(weekDay => (
                            <ToggleGroup.Item 
                                key={weekDay.value}
                                value={weekDay.value}
                                title={weekDay.title}
                                className={`w-8 h-18 rounded  ${weekDays.includes(weekDay.value) ? 'bg-violet-500' : 'bg-zinc-900'}`}
                            >
                                {weekDay.label}
                            </ToggleGroup.Item>
                        ))}
                    </ToggleGroup.Root>
                </div>
                <div className='flex flex-col gap-2 flex-1'>
                    <label htmlFor="hourStart">Qual horário do dia?</label>
                    <div className='grid grid-cols-2 gap-2'>
                    <input id="hourStart" name="hourStart" type="time" placeholder="De" className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'/>
                    <input id="hourEnd" name="hourEnd" type="time" placeholder="Até" className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'/>
                    </div>
                </div>
                </div>

                <label className="mt-2 flex items-center gap-2 text-sm">
                    <Checkbox.Root className="w-6 h-6 p-1 rounded bg-zinc-900" checked={useVoiceChannel} onCheckedChange={(checked) => {
                        if(checked) {
                            setUseVoiceChannel(true)
                        } else {
                            setUseVoiceChannel(false)
                        }
                    }}>
                        <Checkbox.Indicator>
                            <Check className="w-4 h-4 text-emerald-400"/>
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    Costume conectar no chat de voz
                </label>

                <footer className='mt-4 flex justify-end gap-4'>
                <Dialog.Close type="button" className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600">Cancelar</Dialog.Close>
                <button className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600" type='submit'>
                    <GameController size={24} /> Encontrar duo
                </button>
                </footer>
            </form>
        </Dialog.Content>
        </Dialog.Overlay>
    </Dialog.Portal>
   );
}