"use client"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link";

type BackButtonProps = BackButtonAsLink | BackButtonAsFunction;

type BackButtonAsLink = {
    as: 'link';
    href?: string | "goBack" | null; // URL to navigate to when clicked
    onClick?: never; // No onClick if using link
    disabled?: never; // No disabled state for link
}

type BackButtonAsFunction = {
    as?: 'function'; // Optional, defaults to function if not provided
    href?: never; // No href if using function
    onClick: () => void;
    disabled?: boolean; // Optional disabled state
}

export function BackButton(Props: BackButtonProps) {
    const router = useRouter();
    const { as, href, onClick, disabled } = Props;
    
    // Function to handle the back button click
    const handleBack = () => {
        router.back();
    }
    
    return (
        <div className="fixed top-4 left-4 z-50">
            {as === 'function' ? (
                <Button
                    variant="outline"
                    size={"sm"}
                    className={`text-muted-foreground hover:text-foreground aspect-square w-auto h-auto border backdrop-blur-sm ${disabled ? "cursor-not-allowed opacity-60 pointer-events-none" : ""}`}
                    onClick={() => {
                        if (!disabled) {
                            onClick?.();
                        }
                    }}
                    disabled={disabled}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            ) : (
                href === "goBack" ? (
                    <Button
                        variant="outline"
                        size={"sm"}
                        className={`text-muted-foreground hover:text-foreground aspect-square w-auto h-auto border backdrop-blur-sm ${disabled ? "cursor-not-allowed opacity-60 pointer-events-none" : ""}`}
                        onClick={() => {
                            if (!disabled) {
                                handleBack();
                            }
                        }}
                        disabled={disabled}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                ) : (
                    <Link href={href ? href : "#"} className="text-muted-foreground hover:text-foreground aspect-square w-auto h-auto border inline-flex items-center justify-center backdrop-blur-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                )
            )}
        </div>
    )
}