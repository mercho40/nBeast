import React from "react";
import Link from "next/link";

type RenderTextWithActionsProps = RenderTextWithActionsAsLink | RenderTextWithActionsAsFunction;

type RenderTextWithActionsAsLink = {
  text: string;
  as: 'link';
  href: string | string[]; // supports multiple placeholders
  onClick?: never;
  disabled?: never;
  className?: string;
}

type RenderTextWithActionsAsFunction = {
  text: string;
  as?: 'function';
  href?: never;
  onClick: (index?: number) => void; // index of the placeholder clicked
  disabled?: boolean;
  className?: string;
}

export const renderTextWithActions = (props: RenderTextWithActionsProps) => {
  const { text } = props;
  const parts = String(text ?? "").split("##");
  let idx = 0;

  const nodes = parts.map((part, i) => {
    if (i % 2 === 0) {
      return <span key={`txt-${i}`}>{part}</span>;
    }

    const label = part;
    const currentIndex = idx++;
    if (props.as === 'link') {
      const href = Array.isArray(props.href) ? (props.href[currentIndex] ?? "#") : props.href;
      const cls = props.className ? `${props.className} inline` : "inline";
      return (
        <Link key={`lnk-${i}`} href={href} className={cls}>
          {label}
        </Link>
      );
    }

    const disabled = props.disabled;
    const cls = `${props.className ?? ""} inline ${disabled ? "cursor-not-allowed opacity-60 pointer-events-none" : "cursor-pointer"}`.trim();
    return (
      <p
        key={`act-${i}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cls}
        onClick={() => {
          if (disabled) return;
          props.onClick?.(currentIndex);
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onClick?.(currentIndex);
          }
        }}
      >
        {label}
      </p>
    );
  });

  return <>{nodes}</>;
}