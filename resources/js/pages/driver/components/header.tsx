export default function Header() {
    return (
        <header className="flex w-full flex-col items-center gap-4 text-center">
            {/* Responsive SVG Container */}
            <div className="w-full max-w-[220px] transition-transform duration-300 hover:scale-[1.02] sm:max-w-[280px] md:max-w-[320px]">
                <img
                    src="/assets/find-park.svg"
                    alt="ParkFinder Illustration"
                    className="h-auto w-full object-contain"
                />
            </div>

            {/* Typography Stack */}
            <div className="flex flex-col items-center gap-2 px-2">
                <h1 className="text-foreground text-2xl font-extrabold tracking-tight text-balance text-primary sm:text-3xl lg:text-4xl">
                    Find possible parking near your destination
                </h1>

                <p className="text-muted-foreground max-w-md text-sm leading-relaxed text-balance sm:text-base">
                    Search for a destination to find known parking locations
                    nearby. We help you find places worth trying.
                </p>
            </div>
        </header>
    );
}
