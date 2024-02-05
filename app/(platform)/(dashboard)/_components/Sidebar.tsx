"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import NavItem, { Organization } from "./NavItem";

interface SidebarProps {
  storageKey?: string;
}

export default function Sidebar({
  storageKey = "trello-clone-sidebar-state",
}: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );
  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();
  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  const onExpanded = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Accordion type="multiple" defaultValue={defaultAccordionValue}>
        {userMemberships.data?.map(({ organization }) => {
          return (
            <NavItem
              key={organization.id}
              isActive={organization.id === activeOrganization?.id}
              isExpanded={expanded[organization.id]}
              organization={organization as Organization}
              onExpanded={onExpanded}
            />
          );
        })}
      </Accordion>
    </>
  );
}
