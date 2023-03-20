export function applyTheme(theme) {
  console.log(theme);
  const root = document.documentElement;
  Object.keys(theme).forEach((cssVar) => {
    root.style.setProperty(cssVar, theme[cssVar]);
  });
}

export function createTheme({ primary, secondary }) {
  return {
    "--theme-primary": primary,
    "--theme-secondary": secondary,
  };
}
