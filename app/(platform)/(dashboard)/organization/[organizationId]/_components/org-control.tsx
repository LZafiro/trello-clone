"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

/**
 * This component is used to set the active organization in the organization list
 * when the organizationId changes in the URL. There is a problem where when the url
 * changes, the organization list does not update the active organization. This component
 * is a workaround for that problem.
 */
export default function OrgControl() {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({ organization: params.organizationId as string });
  }, [params.organizationId, setActive]);

  return null;
}
