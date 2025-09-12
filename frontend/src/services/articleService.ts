export interface Article {
    id: string
    name: string
    quantity: number
    unit: string
    lowStockThreshold: number
}

export async function getAllArticles(): Promise<Article[]> {
    const response = await fetch("http://localhost:8080/articles")
    if (!response.ok) {
        throw new Error("Failed to fetch articles")
    }
    return response.json()
}
