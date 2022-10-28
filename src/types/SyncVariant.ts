export interface Files {
  id: number;
  type: string;
  hash: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
}

export interface SyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  main_category_id: number;
  warehouse_product_variant_id: null;
  retail_price: string;
  sku: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: string;
    image: string;
    name: string;
  };
  files: Array<Files>;
  options: [
    {
      id: string;
      value: string;
    },
    {
      id: string;
      value: string;
    },
    {
      id: string;
      value: string;
    },
    {
      id: string;
      value: string;
    },
    {
      id: string;
      value: string;
    },
    {
      id: string;
      value: string;
    }
  ];
  is_ignored: boolean;
}
