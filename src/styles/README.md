# Styles

This folder contains SCSS stylesheets for the weather application.

## Files

- `main.scss` - Main entry point that imports all partials
- `_variables.scss` - CSS custom properties and design tokens
- `_themes.scss` - Theme definitions (pink, dark, white, contrasty)
- `_mixins.scss` - Reusable SCSS mixins
- `_utilities.scss` - Utility classes for spacing, flexbox, text, etc.
- `_components.scss` - Component-specific styles

## Usage

Import `main.scss` in the application entry point. Use class-based styling throughout components.

## Theming

Themes are applied by adding a class to the body element:
- `.theme-pink` - Pink/rose color scheme
- `.theme-dark` - Dark mode
- `.theme-white` - Light mode (default)
- `.theme-contrasty` - High contrast accessibility theme
