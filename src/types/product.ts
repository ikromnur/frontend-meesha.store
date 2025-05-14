export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: {
    url: string;
    publicId: string;
  };
  size: Size;
  variant: string[];
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    key: string;
    name: string;
  };
  type: {
    id: string;
    key: string;
    name: string;
  };
  objective: {
    id: string;
    key: string;
    name: string;
  };
  color: {
    id: string;
    key: string;
    name: string;
  };
};

export enum Size {
  SMALL = "S",
  MEDIUM = "M",
  LARGE = "L",
  XL = "XL",
}
