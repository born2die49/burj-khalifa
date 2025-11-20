import { baseApiSlice } from "@/lib/redux/features/api/baseApiSlice";
import {
	NonTenantResponse,
	ProfileData,
	ProfileResponse,
	ProfilesResponse,
	QueryParams,
} from "@/types";

export const usersApiSlice = baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllUsers: builder.query<ProfilesResponse, QueryParams>({
			query: (params = {}) => {
				// Create a helper to manage ?page=1&search=term
				const queryString = new URLSearchParams();

				if (params.page) {
					queryString.append("page", params.page.toString());
				}
				if (params.searchTerm) {
					queryString.append("search", params.searchTerm);
				}

				// Returns: /profiles/all/?page=1&search=john
				return `/profiles/all/?${queryString.toString()}`;
			},
			// LABEL this data as "User" data
			providesTags: ["User"],
		}),

		getAllTechnicians: builder.query<NonTenantResponse, QueryParams>({
			query: (params = {}) => {
				const queryString = new URLSearchParams();

				if (params.page) {
					queryString.append("page", params.page.toString());
				}
				if (params.searchTerm) {
					queryString.append("search", params.searchTerm);
				}
				return `/profiles/non-tenant-profiles/?${queryString.toString()}`;
			},
			providesTags: ["User"],
		}),

		getUserProfile: builder.query<ProfileResponse, void>({
			query: () => "/profiles/user/my-profile/",
			providesTags: ["User"],
		}),

		updateUserProfile: builder.mutation<ProfileData, ProfileData>({
			query: (formData) => ({
				url: "/profiles/user/update/",
				method: "PATCH",
				body: formData,
			}),
			// CRITICAL: This tells Redux "The 'User' data has changed!"
			// This forces getAllUsers and getUserProfile to auto-refetch immediately.
			invalidatesTags: ["User"],
		}),
	}),
});

export const {
	useGetAllUsersQuery,
	useGetAllTechniciansQuery,
	useGetUserProfileQuery,
	useUpdateUserProfileMutation,
} = usersApiSlice;
