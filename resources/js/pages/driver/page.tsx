import BackgroundMap from '@/components/map/background-map';
import SearchLocation from '@/components/map/search-location';
import Header from './components/header';

export default function Page() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
                <BackgroundMap />
            </div>

            <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-[2px] dark:bg-slate-950/60" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
                <Header />

                <main className="mt-6 flex w-full flex-1 justify-center sm:mt-8">
                    <SearchLocation />
                </main>
            </div>
        </div>
    );
}
