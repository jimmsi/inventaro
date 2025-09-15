import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {CheckCircle, AlertTriangle, Pencil, CircleMinus, CirclePlus, Trash} from "lucide-react"
import {type Article} from "@/services/articleService"

type ArticleTableProps = {
    articles: Article[]
    onEdit: (article: Article) => void
    onUpdateQuantity: (article: Article, newQuantity: number) => void
    onDelete: (article: Article) => void
}

function ArticleTable({articles, onEdit, onUpdateQuantity, onDelete}: ArticleTableProps) {
    return (
        <div className="bg-white shadow border rounded-md text-base p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-gray-500 p-4">#</TableHead>
                        <TableHead className="font-semibold text-gray-500 p-2">Antal</TableHead>
                        <TableHead className="font-semibold text-gray-500 p-2">Enhet</TableHead>
                        <TableHead className="font-semibold text-gray-500 p-2">Lagerstatus</TableHead>
                        <TableHead className="font-semibold text-gray-500 p-2"></TableHead>{/* Increment-decrement */}
                        <TableHead className="font-semibold text-gray-500 p-2"></TableHead>{/* Edit/Delete-knapp */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article) => {
                        const isLowStock = article.quantity <= article.lowStockThreshold
                        return (
                            <TableRow key={article.id} className="hover:bg-accent">
                                <TableCell className="font-medium pl-4">{article.name}</TableCell>
                                <TableCell className="p-2">
                                    {article.quantity}
                                </TableCell>
                                <TableCell className="p-2">{article.unit}</TableCell>
                                <TableCell className="p-2 mt-1.5 flex items-center space-x-2">
                                    {isLowStock ? (
                                        <>
                                            <AlertTriangle className="w-4 text-red-500"/>
                                            <span className="text-red-600">Behöver fyllas på</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 text-green-600"/>
                                            <span className="text-green-600">I lager</span>
                                        </>
                                    )}
                                </TableCell>
                                <TableCell className="p-2 text-center space-x-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onUpdateQuantity(article, article.quantity - 1)}
                                        disabled={article.quantity <= 0}
                                    >
                                        <CircleMinus className="h-4 w-4 text-gray-500"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onUpdateQuantity(article, article.quantity + 1)}
                                    >
                                        <CirclePlus className="h-4 w-4 text-gray-500"/>
                                    </Button>
                                </TableCell>
                                <TableCell className="p-2 text-right space-x-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(article)}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(article)}
                                    >
                                        <Trash className="h-4 w-4 text-red-600"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default ArticleTable
