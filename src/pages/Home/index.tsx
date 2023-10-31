import { useState } from "react";

import { Play } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

import { 
    CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    MinutesAmountInput, 
    Separator, 
    StartCountdownButton, 
    TaskInput
} from "./styles";


const newCycleFormValidationSchema = z.object({
    task: z.string().min(1, "Informe a tarefa"),
    minutesAmount: z
    .number()
    .min(5, "O intervalo precisa ser de no mínimo 5 minutos")
    .max(60, "O intervalo precisa ser de no máximo 60 minutos"),

})

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;

}

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActivedCycleId] = useState<string | null>(null);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    });

    function handleCreateNewCycle(data: NewCycleFormData) {

        const id = String(new Date().getTime());
        
        const newCycles: Cycle = {
            id,
            minutesAmount: data.minutesAmount,
            task: data.task
        };

        setCycles((prev) => [...prev, newCycles]);
        setActivedCycleId(id);

        reset();
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const task =  watch("task");
    const isSubmitDissabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>

                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestion"
                        {...register("task")}
                    />

                    <datalist id="task-suggestion">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Projeto 4"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register("minutesAmount", { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
            

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>

                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={isSubmitDissabled}>
                    <Play size={24}/>       
                    Começar
                </StartCountdownButton>

            </form>
        </HomeContainer>
    );
}