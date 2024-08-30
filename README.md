# Barrel v2

Welcome to the Barrel v2 repository! This project is built using Vite, React, Tailwind and Shadcn components to provide a fast and modern development experience.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Components](#components)
  - [Ui](#ui)
  - [Typography](#typography)
  - [Button](#button)

## Introduction

This project leverages Vite for lightning-fast build times and a smooth development experience.

## Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

Ensure you have the following tools installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/)
- Check out [Shadcn](https://ui.shadcn.com/docs) documentation.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
   ```

2. Install dependecies:
   ```bash
   npm run dev
   ```

### Scripts

Here are some useful scripts for development and production:

`npm run dev`: Start the development server.
`npm run build`: Build the project for production.

## Folder Structure

Here's an overview of the project's folder structure:

public:

- fonts
- images

src:

- components:
  - common
  - layout
  - modules
  - ui
- helpers
- hooks
- lib
- pages
- router
- store
- types

## Components

### Ui

#### Typography

The `Text` component is a flexible and reusable component for rendering text elements with various styling options.

##### Imports

The component imports necessary modules:

- `React`: for creating React components.
- `cn` from `@/lib/utils`: likely a utility function for joining classNames.
- `cva` and `VariantProps` from `class-variance-authority`: for creating a variant class applicator.

##### Text Variants

The component defines a set of text variants using cva. These variants allow for styling text based on different options like headings and body text. Each variant defines styles for font size and line height.

##### Props

The component accepts the following props:

- `element`: (Optional) Specifies the HTML element to render the text content. Defaults to "p" (paragraph). Can be one of "h1", "h2", "h3", "h4", "h5", "h6", "p", or "span".
- `className`: (Optional) Additional CSS class names to apply to the element.
- `variant`: (Optional) Specifies the text variant to use from the defined set. Defaults to "body4".
- `children`: The content to be rendered inside the element (text or other components).
- Other HTML attributes: Any valid HTML attributes for the chosen element (e.g., id, style).
  Note: The component also accepts props from the `VariantProps` type provided by `class-variance-authority`, allowing for further customization of variants.

##### Usage

```Javascript
import { Text } from "@/components/ui/text";

<Text variant="heading2">This is a heading</Text>

<Text element="span" className="text-red-500" variant="body3">
  Some body text with custom styling
</Text>
```

#### Button

##### Imports

The component imports necessary modules:

- `React`: for creating React components.
- `Slot` from `@radix-ui/react-slot`: likely a component for rendering content within a designated slot.
- `cva` and `VariantProps` from `class-variance-authority`: for creating a variant class applicator for styling buttons.
- `cn` from `@/lib/utils`: likely a utility function for joining classNames.

##### Button Variants

The component defines a set of button variants using cva. These variants allow for styling buttons with different appearances and behaviors based on options like primary, secondary, ghost buttons, and different sizes.

##### Button Props

The Button component accepts the following props:

- `className`: (Optional) Additional CSS class names to apply to the button.
- `variant`: (Optional) Specifies the button variant to use from the defined set. Defaults to "primary".
- `size`: (Optional) Specifies the button size from the defined set. Defaults to "default".
- `asChild`: (Optional) Boolean flag indicating whether the button should render as a Slot component (likely for internal use within a custom component). Defaults to false.
- Other HTML button attributes: Any valid HTML attributes for the button element (e.g., type, disabled).
  Note: The component also accepts props from the VariantProps type provided by `class-variance-authority`, allowing for further customization of variants.

##### Button Usage

```JavaScript
import { Button } from "@/components/ui/button";

<Button>Button</Button>

<Button variant="secondary">Button</Button>

<Button variant="ghost">Button</Button>
```

#### ButtonIcon Component

The ButtonIcon component allows you to add icons to the left or right side of a button.

##### Props:

- `className`: (Optional) Additional CSS class names to apply to the icon container.
- `children`: The content to render inside the icon container (typically an icon component).
- `position`: Specifies the icon's position within the button: "left" or "right".
- Other HTML span attributes: Any valid HTML attributes for the span element.

##### Usage:

```JavaScript
import { Button, ButtonIcon } from "@/components/ui/button";

<Button>
  <ButtonIcon position="left">
    {/* Your icon component here */}
  </ButtonIcon>
  Click me
</Button>
```
