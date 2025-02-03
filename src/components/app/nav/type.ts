
export type Link = `/${string}` | "#";
export type LinkItem = {
  name: string;
  link: Link;
  children: LinkItem[] | null;
  enable: boolean;
};
