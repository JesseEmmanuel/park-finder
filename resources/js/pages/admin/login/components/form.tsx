import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Form() {
    return (
        <div className="w-full max-w-md">
            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card sm:p-8">
                <div className="flex flex-col items-center gap-4 mb-8 text-center">
                    {/* <h1 className="text-headline-md text-primary">
                        Welcome back
                    </h1> */}
                    <img src="/assets/parkfinder-initial-logo.png" alt="ParkFinder" width={200} />

                    <p className="mt-2 text-body-md text-on-surface-variant">
                        Sign in as Admin or Collaborator
                    </p>
                </div>

                <form className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="min-h-12 rounded-md border-outline-variant bg-surface px-4 text-body-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            autoComplete="current-password"
                            className="min-h-12 rounded-md border-outline-variant bg-surface px-4 text-body-md"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="min-h-12 w-full rounded-md bg-primary text-label-bold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                    >
                        Sign in
                    </Button>
                </form>
            </div>

            <p className="mt-6 px-4 text-center text-label-sm text-on-surface-variant">
                By continuing, you agree to our{' '}
                <a href="#" className="font-semibold text-secondary hover:underline">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-secondary hover:underline">
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    )
}
