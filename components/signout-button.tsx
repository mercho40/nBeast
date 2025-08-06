"use client"
import { useRouter } from 'next/navigation'
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

interface SignOutProps {
  dict: {
    auth: {
      signOut: string;
    };
  };
}

export function SignOut({ dict }: SignOutProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Button onClick={handleSignOut} variant="destructive">
      {dict.auth.signOut}
    </Button>
  );
}

