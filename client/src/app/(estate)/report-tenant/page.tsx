import { AuthFormHeader } from "@/components/forms/auth";
import CreateReportForm from "@/components/forms/report-tenant/CreateReportForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Report Tenant",
	description: "Tenants can report their fellow tenants in cases of misconduct or misbehavior",
};

import React from 'react'

export default function ReportTenantPage() {
  return (
    <div>
      <AuthFormHeader title="Report a Tentant" staticText="All reports will remain annonymous. We will act accordingly, but won't disclose details of who raised the concern" linkHref="/profile" linkText="Back to Profile"/>
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
          <CreateReportForm />
        </div>
      </div>
    </div>
  )
}
