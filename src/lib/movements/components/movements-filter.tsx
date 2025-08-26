"use client"

import { Search, Loader2 } from "lucide-react"
import { movementTypeFilterOptions } from "../utils"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/lib/layout/components/ui/input"
import { Label } from "@/lib/layout/components/ui/label"
import { TransactionType } from "@prisma/client"
import { useDebounce } from "use-debounce"

type FilterFormData = {
  search: string
  transactionType: TransactionType | "ALL"
}

export function MovementsFilter({
  onSubmit,
}: {
  onSubmit: (data: { search?: string; type?: TransactionType }) => void
}) {
  const [isPending, startTransition] = useTransition()

  const { register, watch, getValues } = useForm<FilterFormData>({
    defaultValues: {
      search: "",
      transactionType: "ALL",
    },
  })

  const searchField = watch("search")
  const transactionTypeField = watch("transactionType")
  const [debouncedSearch] = useDebounce(searchField, 300)

  // Handle debounced search changes
  useEffect(() => {
    startTransition(() => {
      const formData = getValues()
      onSubmit({
        search: debouncedSearch,
        type:
          formData.transactionType === "ALL"
            ? undefined
            : formData.transactionType,
      })
    })
  }, [debouncedSearch])

  // Handle immediate transaction type changes
  useEffect(() => {
    startTransition(() => {
      const formData = getValues()
      onSubmit({
        search: formData.search,
        type: transactionTypeField === "ALL" ? undefined : transactionTypeField,
      })
    })
  }, [transactionTypeField])

  return (
    <div className="my-4 space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-2 px-4 shadow-2xl shadow-gray-200">
        {isPending ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Search className="text-muted-foreground h-4 w-4" />
        )}
        <Input
          {...register("search")}
          className="w-full border-none shadow-none outline-0 focus-visible:ring-0 focus-visible:outline-none"
          placeholder="Ingresa un nombre o servicio"
        />
      </div>
      <div className="flex gap-2 overflow-x-scroll md:overflow-x-auto">
        {movementTypeFilterOptions.map((filter) => {
          return (
            <div key={filter.label}>
              <Input
                {...register("transactionType")}
                id={filter.label}
                type="radio"
                className="peer hidden"
                value={filter.value}
                defaultChecked={filter.defaultChecked}
              />
              <Label
                htmlFor={filter.label}
                className="cursor-pointer rounded-xl border px-4 py-3 peer-checked:bg-zinc-700 peer-checked:text-white"
              >
                {filter.label}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
