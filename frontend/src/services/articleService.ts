export interface Article {
    id: string
    name: string
    quantity: number
    unit: string
    lowStockThreshold: number
}

const API_URL = "http://localhost:8080"

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed with status ${response.status}`)
    }

    return response.json()
}

export async function getAllArticles(): Promise<Article[]> {
    return apiFetch<Article[]>(`${API_URL}/articles`)
}

export async function createArticle(article: Omit<Article, "id">): Promise<Article> {
    return apiFetch<Article>(`${API_URL}/articles`, {
        method: "POST",
        body: JSON.stringify(article),
    })
}

// NOTE - Update article (only name, unit, and lowStockThreshold)
export async function updateArticle(
    id: string,
    updated: Omit<Article, "id" | "quantity">
): Promise<Article> {
    return apiFetch<Article>(`${API_URL}/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
    })
}

export async function updateArticleQuantity(id: string, quantity: number): Promise<Article> {
    return apiFetch<Article>(`${API_URL}/articles/${id}/quantity`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
    })
}

export async function deleteArticle(id: string): Promise<void> {
    await apiFetch<void>(`${API_URL}/articles/${id}`, {
        method: "DELETE",
    })
}



