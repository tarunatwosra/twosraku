"use client";

import { PageHeader } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface DetailPageSection {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface DetailPageAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  icon?: React.ReactNode;
}

interface DetailPageTemplateProps {
  // Page info
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];

  // Actions
  actions?: DetailPageAction[];
  backHref?: string;

  // Content sections
  sections?: DetailPageSection[];

  // Tabs
  tabs?: {
    label: string;
    content: React.ReactNode;
  }[];

  // Custom header
  headerContent?: React.ReactNode;

  // Class name
  className?: string;
}

export function DetailPageTemplate({
  title,
  description,
  breadcrumbs,
  actions,
  sections,
  tabs,
  headerContent,
  className,
}: DetailPageTemplateProps) {
  return (
    <div className={cn("flex flex-col gap-[24px]", className)}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          actions && actions.length > 0 && (
            <div className="flex items-center gap-[12px]">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )
        }
      />

      {/* Custom Header Content */}
      {headerContent}

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <TabContainer tabs={tabs} />
      )}

      {/* Sections */}
      {sections && sections.map((section, index) => (
        <Card key={index} padding="md">
          <div className="mb-[20px]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-[13px] text-[var(--text-muted)] mt-1">
                {section.description}
              </p>
            )}
          </div>
          <div className={section.className}>{section.children}</div>
        </Card>
      ))}
    </div>
  );
}

// Tab Component
import { useState } from "react";

interface TabContainerProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
}

function TabContainer({ tabs }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card padding="none">
      {/* Tab Header */}
      <div className="flex items-center gap-[4px] p-[8px] border-b border-[var(--border-light)]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-[14px] font-medium rounded-[14px] transition-all duration-200",
              activeTab === index
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-[20px]">{tabs[activeTab]?.content}</div>
    </Card>
  );
}
