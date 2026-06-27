export type Orientation = "portrait" | "landscape" | "square";

export interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  orientation: Orientation;
  name: string;
}

export type PageType = "cover" | "title" | "photo" | "back";

export interface BookPage {
  id: string;
  type: PageType;
  /** css template class for the photo grid (photo pages only) */
  template?: string;
  photos: Photo[];
  caption?: string;
}
