export const applyTheme = (theme) => {
  // const DEFAULT = {
  //   primary: "blue-500",
  //   secondary: "blue-100",
  // };

  // const REDMINE = {
  //   primary: "red-500",
  //   secondary: "red-100",
  // };

  // const SUNSHINE = {
  //   primary: "orange-500",
  //   secondary: "orange-100",
  // };

  switch (theme) {
    case "REDMINE":
      // eslint-disable-next-line no-unused-expressions
      return {
        primary: "bg-red-600",
        secondary: "bg-red-200",
        textprimary: "text-red-600",
        textsecondary: "text-red-100",
        textwhite: "text-gray-50",
        hoverBgPrimary: "hover:bg-red-600",
        hoverBgSecondary: "hover:bg-red-400",
        hoverPrimary: "hover:bg-red-600 hover:text-red-100",
        hoverSecondary: "hover:bg-red-100 hover:text-red-600",
        bgAudioLoader: "#dc2626",
      };
    case "SUNSHINE":
      // eslint-disable-next-line no-unused-expressions
      return {
        primary: "bg-orange-600",
        secondary: "bg-orange-200",
        textprimary: "text-orange-600",
        textsecondary: "text-orange-100",
        textwhite: "text-gray-50",
        hoverBgPrimary: "hover:bg-orange-600",
        hoverBgSecondary: "hover:bg-orange-400",
        hoverPrimary: "hover:bg-orange-600 hover:text-orange-100",
        hoverSecondary: "hover:bg-orange-100 hover:text-orange-600",
        bgAudioLoader: "#ea580c",
      };
    default:
      // eslint-disable-next-line no-unused-expressions
      return {
        primary: "bg-blue-600",
        secondary: "bg-blue-200",
        textprimary: "text-blue-600",
        textsecondary: "text-blue-100",
        textwhite: "text-gray-50",
        hoverBgPrimary: "hover:bg-blue-600",
        hoverBgSecondary: "hover:bg-blue-400",
        hoverPrimary: "hover:bg-blue-600 hover:text-blue-100",
        hoverSecondary: "hover:bg-blue-100 hover:text-blue-600",
        bgAudioLoader: "#2563eb",
      };
  }
};
