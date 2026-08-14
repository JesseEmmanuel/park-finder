import SearchLocation from '@/components/map/search-location';
import Header from './components/header'

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col mx-4 gap-4">
            <Header />

            <main className="flex flex-1 justify-center">
                <SearchLocation />
            </main>
        </div>
    );
}