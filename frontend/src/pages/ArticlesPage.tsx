import { useEffect, useState } from "react"
import {
    getAllArticles,
    createArticle,
    type Article,
} from "@/services/articleService"

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        name: "",
        quantity: 0,
        unit: "",
        lowStockThreshold: 0,
    })
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const { toast } = useToast()

    // Hämta artiklar vid mount
    useEffect(() => {
        getAllArticles()
            .then((data) => { setArticles(data); setLoading(false) })
            .catch((err) => { setError(err.message); setLoading(false) })
    }, [])

    // Nollställ fel + formulär när dialogen stängs
    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (!next) {
            setSubmitError(null)
            setForm({ name: "", quantity: 0, unit: "", lowStockThreshold: 0 })
        }
    }

    // Hantera submit för ny artikel
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setSubmitError(null)

        // Enkel client-validering
        if (form.quantity < 0 || form.lowStockThreshold < 0) {
            setSubmitting(false)
            setSubmitError("Antal och minimumnivå kan inte vara negativa.")
            setTimeout(() => setSubmitError(null), 3000)
            return
        }

        try {
            const newArticle = await createArticle({
                name: form.name.trim(),
                quantity: Number(form.quantity),
                unit: form.unit.trim(),
                lowStockThreshold: Number(form.lowStockThreshold),
            })

            setArticles((prev) => [...prev, newArticle])
            // Stäng först, visa sen toast (så overlay inte mörkar den)
            handleOpenChange(false)
            toast({
                title: "Artikel skapad",
                description: `${newArticle.name} lades till.`,
            })
        } catch (err: any) {
            // Visa fel inline i dialogen istället för toast under overlay
            setSubmitError(err?.message || "Kunde inte skapa artikel.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <p className="p-4">Loading articles...</p>
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>

    return (
        <div className="bg-gray-100 min-h-screen p-12">
            {/* Header + skapa-knapp */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-baseline space-x-2">
                    <h1 className="text-3xl font-bold">inventaro</h1>
                    <span className="text-2xl text-gray-500">materiallager</span>
                </div>

                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>Ny artikel</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                        <DialogHeader>
                            <DialogTitle>Skapa artikel</DialogTitle>
                        </DialogHeader>

                        {/* Inline fel överst i formuläret */}
                        {submitError && (
                            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {submitError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Namn</Label>
                                <Input
                                    id="name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="quantity">Antal</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="unit">Enhet</Label>
                                <Input
                                    id="unit"
                                    value={form.unit}
                                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="threshold">Minsta lagerantal innan varning</Label>
                                <Input
                                    id="threshold"
                                    type="number"
                                    value={form.lowStockThreshold}
                                    onChange={(e) =>
                                        setForm({ ...form, lowStockThreshold: Number(e.target.value) })
                                    }
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={submitting} className="w-full">
                                {submitting ? (
                                    <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sparar…
                  </span>
                                ) : (
                                    "Spara"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Artikeltabell */}
            <div className="bg-white shadow border rounded-md text-base p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold text-gray-500 p-4">#</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Antal</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Enhet</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Lagerstatus</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article) => {
                            const isLowStock = article.quantity <= article.lowStockThreshold
                            return (
                                <TableRow key={article.id} className="hover:bg-accent">
                                    <TableCell className="font-medium p-4">{article.name}</TableCell>
                                    <TableCell className="p-4">{article.quantity}</TableCell>
                                    <TableCell className="p-4">{article.unit}</TableCell>
                                    <TableCell className="p-4 flex items-center space-x-2">
                                        {isLowStock ? (
                                            <>
                                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                                <span className="text-red-600">Behöver fyllas på</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-green-600">I lager</span>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ArticlesPage
