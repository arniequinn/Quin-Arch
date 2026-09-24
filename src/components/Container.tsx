import React from "react";

// The one horizontal layout rule (R6 of documentation/final-polish-v2.0.md): every section sits in
// one of two centered columns, so headings and text line up down the whole page instead of each
// section picking its own max-width.
//  - wide: galleries, grids and anything with columns
//  - text: the reading column for paragraphs and lists
export type ContainerWidth = "wide" | "text";

const WIDTHS: Record<ContainerWidth, string> = {
  wide: "max-w-7xl",
  text: "max-w-3xl",
};

type ContainerTag = "div" | "section" | "article" | "aside";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  width?: ContainerWidth;
  as?: ContainerTag;
}

export const Container: React.FC<ContainerProps> = ({
  width = "wide",
  as: Tag = "div",
  className = "",
  children,
  ...rest
}) => (
  <Tag {...rest} className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${WIDTHS[width]} ${className}`}>
    {children}
  </Tag>
);
