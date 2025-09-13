import { useEffect, useState } from "react"
import {
    getAllArticles,
    createArticle,
    updateArticle,
    updateArticleQuantity,
    type Article,
} from "@/services/articleService"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

import ArticleForm, { type ArticleFormValues } from "@/components/ArticleForm"
import ArticleTable from "@/components/ArticleTable"

function ArticlePage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [openCreate, setOpenCreate] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [articleToEdit, setArticleToEdit] = useState<Article | null>(null)

    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const { toast } = useToast()

    useEffect(() => {
        getAllArticles()
            .then((data) => {
                setArticles(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    const handleCreate = async (values: ArticleFormValues) => {
        setSubmitting(true)
        setSubmitError(null)
        try {
            const newArticle = await createArticle(values)
            setArticles((prev) => [...prev, newArticle])
            setOpenCreate(false)
            toast({
                title: "Artikel skapad",
                description: `${newArticle.name} lades till.`,
            })
        } catch (err: unknown) {
            setSubmitError(
                err instanceof Error ? err.message : "Kunde inte skapa artikel"
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = async (values: ArticleFormValues) => {
        if (!articleToEdit) return
        setSubmitting(true)
        setSubmitError(null)
        try {
            const updated = await updateArticle(articleToEdit.id, {
                name: values.name,
                unit: values.unit,
                lowStockThreshold: values.lowStockThreshold,
            })
            setArticles((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
            )
            setOpenEdit(false)
            setArticleToEdit(null)
            toast({
                title: "Artikel uppdaterad",
                description: `${updated.name} uppdaterades.`,
            })
        } catch (err: unknown) {
            setSubmitError(
                err instanceof Error ? err.message : "Kunde inte uppdatera artikel"
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdateQuantity = async (article: Article, newQuantity: number) => {
        if (newQuantity < 0) return
        try {
            const updated = await updateArticleQuantity(article.id, newQuantity)
            setArticles((prev) =>
                prev.map((a) => (a.id === updated.id ? updated : a))
            )
            toast({
                title: "Lagersaldo uppdaterat",
                description: `${updated.name} har nu ${updated.quantity} ${updated.unit}.`,
            })
        } catch (err: unknown) {
            toast({
                title: "Fel vid uppdatering",
                description:
                    err instanceof Error ? err.message : "Kunde inte uppdatera lagersaldo",
                variant: "destructive",
            })
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
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                    <DialogTrigger asChild>
                        <Button className="bg-gray-200">Ny artikel</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Skapa artikel</DialogTitle>
                        </DialogHeader>
                        <ArticleForm
                            mode="create"
                            onSubmit={handleCreate}
                            submitting={submitting}
                            error={submitError}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Artikeltabell */}
            <ArticleTable
                articles={articles}
                onEdit={(article) => {
                    setArticleToEdit(article)
                    setOpenEdit(true)
                }}
                onUpdateQuantity={handleUpdateQuantity}
            />

            {/* Edit-dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Redigera artikel</DialogTitle>
                    </DialogHeader>
                    {articleToEdit && (
                        <ArticleForm
                            mode="edit"
                            initialValues={articleToEdit}
                            onSubmit={handleEdit}
                            submitting={submitting}
                            error={submitError}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ArticlePage
