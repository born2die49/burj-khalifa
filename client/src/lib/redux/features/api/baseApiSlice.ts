import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setAuth, setLogout } from "@/lib/redux/features/auth/authSlice"
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react"

import {Mutex} from "async-mutex"

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  credentials: "include"
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async(args, api, extraoptions) => {
  // 1. Check if the lock is active right now.
  await mutex.waitForUnlock()

  // 2. Attempt the actual API request
  let response = await baseQuery(args, api, extraoptions)

  // 3. Check if the request failed with a 401 (Unauthorized)
  if(response.error && response.error.status === 401) {

    // 4. Check if the mutex is NOT locked (meaning I am the first to fail)
    if(!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        // 5. Perform the Refresh Token API call
        const refreshResponse = await baseQuery({
          url: "/auth/refresh/",
          method: "POST",
        }, api, extraoptions);

        // 6. If Refresh Succeeded
        if(refreshResponse?.data) {
          // Update the Redux Store with the new user/token info
          api.dispatch(setAuth());

          // RETRY the original failed request with the new token
          response = await baseQuery(args, api, extraoptions)
        } else {
          // 7. If Refresh Failed (Refresh token is also dead) Log the user out completely
          api.dispatch(setLogout())
        } 
      } finally {
        // 8. ALWAYS release the lock, success or fail.
        release();
      } 
    }
    else {
      // 9. THE "FOLLOWER" LOGIC
      // If we are here, mutex.isLocked() was true. 
      // Someone else is already refreshing.
      
      // Wait for them to finish
      await mutex.waitForUnlock();

      // Now that they finished, try the request again (hopefully with new token)
      response = await baseQuery(args, api, extraoptions)
    }
  }
  return response;
};

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Apartment", "Issue"], 
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({}),
});