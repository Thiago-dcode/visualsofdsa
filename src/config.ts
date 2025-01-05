export const config = {
  links: {
    "data-structures": {
      linear: [
        "stack",
        "queue",
        "static-array",
        "dynamic-array",
        "linked-list",
      ],
      "non-linear": ["graph", "tree", "bts"],
    },
    algorithms: {
      search: [],
      sort: [],
    },
  },
  localStorageKeys: {
    visualizationMode: {
      array: "vod_vma",
      graphs: "vod_vmg",
    },
    speed: {
      sort: "vod_sort_speed"
    },
    theme: "vod_theme",
  },
  darkModeTailwind:
    "text-app-off-black bg-app-off-white  dark:text-app-off-white dark:bg-app-off-black dark:border-app-off-white border-app-off-black",
};
