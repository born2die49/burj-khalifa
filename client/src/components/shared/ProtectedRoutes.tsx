"use client";
import { setAuth, setLogout } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks/typedHooks";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/shared/Spinner";

function ProtectedRoute({children}:{children: React.ReactNode}){
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const handleAuthState = async () => {
      // 1. Check the cookie
      const isLoggedIn = getCookie("logged_in") === "true";

      // 2. Scenario A: User IS logged in
      // Update Redux state to ensure the UI knows we are authenticated
      if (isLoggedIn) {
        dispatch(setAuth())
      } else {
        // 3. Scenario B: User is NOT logged in
        // Clear Redux state to be safe
        dispatch(setLogout())
        router.push("/login")
      }
      // 4. Finish loading
      // Whether authorized or redirected, the check is done.
      setIsLoading(false)
    }
    handleAuthState()
  }, [dispatch, router])

  if (isLoading) {
    return (
      <div className="flex-center pt-32">
        <Spinner size="xl"/>
      </div>
    )
  }

  // If loading is done...
  // We only reach this point if the user was logged in.
  return <>{children}</>
}

export default ProtectedRoute;