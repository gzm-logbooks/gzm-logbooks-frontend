import tailwindConfig from '#tailwind-config';

export const useTheme = () => {
  const { green, amber, red } = tailwindConfig.theme.colors;

  const ratingColors = readonly({
    comfort: green,
    growth: amber,
    anxiety: red,
  });

  return {
    ratingColors,
  };
};
