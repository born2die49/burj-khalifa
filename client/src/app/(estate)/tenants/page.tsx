"use client";
import ProtectedRoute from '@/components/shared/ProtectedRoutes';
import Spinner from '@/components/shared/Spinner';
import { useGetAllUsersQuery } from '@/lib/redux/features/users/usersApiSlice';
import React from 'react'

function TenantsPageContent() {
  // 1. Use the auto-generated hook
  const {data, isLoading} = useGetAllUsersQuery({})

  // 2. Handle Loading State
  if(isLoading) {

    // 3. Render the Data
    return (
      <div className='flex-center pt-2'>
        <Spinner size="xl"/>
      </div>
    )
  }
  return (
    <div>
      <h1 className='dark:text-pumpkin text-6xl'>Tenants</h1>
      {/* Check if data exists */}
      {data && data.profiles.results.length > 0 ? (
        // Map through results and verify tenant details
        data.profiles.results.map((tenant) => (
          <p key={tenant.id} className='text-2xl dark:text-lime-500'>{tenant.full_name} - {tenant.occupation}</p>
        ))
      ) : (
        <p className='text-2xl dark:text-lime-500'>No tenants found.</p>
      )}
    </div>
  )
}

export default function TenantsPage(){
  return (
    <ProtectedRoute>
      <TenantsPageContent/>
    </ProtectedRoute>
  )
}
