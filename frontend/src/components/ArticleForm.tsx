import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export type ArticleFormValues = {
    name: string
    quantity: number
    unit: string
    lowStockThreshold: number
}

type ArticleFormProps = {
    initialValues?: ArticleFormValues
    onSubmit: (values: ArticleFormValues) => void | Promise<void>
    submitting?: boolean
    error?: string | null
    mode?: "create" | "edit"
}

function ArticleForm({
                         initialValues,
                         onSubmit,
                         submitting = false,
                         error,
                         mode,
                     }: ArticleFormProps) {
    const [values, setValues] = useState<ArticleFormValues>(
        initialValues || {
            name: "",
            quantity: 0,
            unit: "",
            lowStockThreshold: 0,
        }
    )

    // uppdatera state om initialValues ändras (t.ex. vid edit)
    useEffect(() => {
        if (initialValues) {
            setValues(initialValues)
        }
    }, [initialValues])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { id, value } = e.target
        setValues((prev) => ({
            ...prev,
            [id]:
                id === "quantity" || id === "lowStockThreshold"
                    ? Number(value)
                    : value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(values)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <Label htmlFor="name">Namn</Label>
                <Input
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                    required
                />
            </div>
            {mode === "create" && (
                <div>
                    <Label htmlFor="quantity">Antal</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min={0}
                        value={values.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}
            <div>
                <Label htmlFor="unit">Enhet</Label>
                <Input
                    id="unit"
                    value={values.unit}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="lowStockThreshold">
                    Visa varning från lagerantal
                </Label>
                <Input
                    id="lowStockThreshold"
                    type="number"
                    min={0}
                    value={values.lowStockThreshold}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="pt-4">
                <Button type="submit" disabled={submitting} className="w-full bg-gray-200">
                    {submitting ? (
                        <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin"/>
            Sparar…
          </span>
                    ) : (
                        "Spara"
                    )}
                </Button>
            </div>
        </form>
)
}

export default ArticleForm
