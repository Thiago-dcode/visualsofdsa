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
      sort: "vod_sort_speed",
      search: "vod_search_speed",
      binarySearchTree: "vod_binary_search_tree_speed",
      linearDs: "vod_linear_ds_speed",
      staticArray: "vod_static_array_speed",
      dynamicArray: "vod_dynamic_array_speed",
      linkedList: "vod_linked_list_speed",
      
    },
    theme: "vod_theme",
    muted: "vod_muted",
  },
  darkModeModal: 'dark:bg-app-off-black bg-app-off-white text-app-text-black dark:text-app-off-white border-2 border-app-bg-black dark:border-app-off-white',
  darkModeTailwind:
    "text-app-off-black bg-app-off-white  dark:text-app-off-white dark:bg-app-off-black dark:border-app-off-white border-app-off-black",
};
