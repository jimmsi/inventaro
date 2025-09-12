import { useEffect, useState } from "react"
import { getAllArticles, type Article } from "@/services/articleService"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getAllArticles()
            .then(data => {
                setArticles(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className="p-4">Loading articles...</p>
    }

    if (error) {
        return <p className="p-4 text-red-500">Error: {error}</p>
    }

    return (
        <div className="bg-gray-100 min-h-screen p-12">
            <div className="flex items-baseline space-x-2 mb-10">
                <h1 className="text-3xl font-bold">inventaro</h1>
                <span className="text-2xl text-gray-500">materiallager</span>
            </div>
            <div className="bg-white shadow border rounded-md text-base p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold text-gray-500 p-4">#</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Antal</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Enhet</TableHead>
                            <TableHead className="font-semibold text-gray-500 p-4">Saldo-status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map(article => (
                            <TableRow key={article.id} className="hover:bg-accent">
                                <TableCell className="font-medium p-4">{article.name}</TableCell>
                                <TableCell className="p-4">{article.quantity}</TableCell>
                                <TableCell className="p-4">{article.unit}</TableCell>
                                <TableCell>
                                    <span className="text-muted-foreground p-2">OK</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ArticlesPage
