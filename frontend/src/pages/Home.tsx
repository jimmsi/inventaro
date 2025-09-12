import { Button } from "@/components/ui/button"


function Home() {
    return (
        <>
            <div>
                <h1 className="text-3xl font-bold underline text-blue-600">Inventaro</h1>
                <p>Welcome to the stock management system.</p>
            </div>
            <div className="p-6 flex gap-4">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Delete</Button>
            </div>
        </>
    );
}

export default Home;