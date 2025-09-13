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

export async function createArticle(article: Omit<Article, "id">): Promise<Article> {
    const response = await fetch("http://localhost:8080/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create article")
    }

    return response.json()
}

export async function updateArticle(
    id: string,
    updated: Omit<Article, "id" | "quantity">
): Promise<Article> {
    const response = await fetch(`http://localhost:8080/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to update article")
    }

    return response.json()
}

