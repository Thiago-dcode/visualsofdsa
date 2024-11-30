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
  visualizationMode:{
    localStorageKeys:{
      array: 'vima',
      graphs:'vimg'
    }
  },
  darkModeTailwind:
    "text-app-off-black bg-app-off-white  dark:text-app-off-white dark:bg-app-off-black dark:border-app-off-white border-app-off-black",
};
