export default function Header() {
    return (
        <div className="flex flex-col gap-2">
            <div className="mx-auto">
                <img
                    src="/assets/car-street.png"
                    alt="ParkFinder"
                    width={400}
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-center text-2xl font-bold text-primary lg:text-4xl">
                    Find possible parking near your destination
                </h1>

                <p className="text-center text-sm text-neutral-500 lg:text-lg">
                    Search for a destination to find known parking locations
                    nearby. We help you find places worth trying.
                </p>
            </div>
        </div>
    );
}
