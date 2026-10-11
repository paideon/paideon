export function createPostcssConfig(tailwindConfigPath: string) {
  return {
    plugins: {
      tailwindcss: {
        config: tailwindConfigPath,
      },
      autoprefixer: {},
    },
  };
}
