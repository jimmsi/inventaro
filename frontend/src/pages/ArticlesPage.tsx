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

import { CheckCircle, AlertTriangle } from "lucide-react"

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
                            <TableHead className="font-semibold text-gray-500 p-4">Lagerstatus</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map(article => {
                            const isLowStock = article.quantity < article.lowStockThreshold
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
