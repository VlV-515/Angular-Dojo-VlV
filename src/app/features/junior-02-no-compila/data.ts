export interface InventoryItem {
  readonly id: string;
  readonly nombre: string;
  readonly cantidad: number;
  readonly categoria: string;
}

export const INVENTARIO: readonly InventoryItem[] = [
  { id: 'karategi-m', nombre: 'Karategi talla M', cantidad: 12, categoria: 'uniforme' },
  { id: 'cinturon-azul', nombre: 'Cinturón azul', cantidad: 0, categoria: 'cinturon' },
  { id: 'guantes-sparring', nombre: 'Guantes de sparring', cantidad: 5, categoria: 'proteccion' },
];

export const STOCK_MINIMO_POR_CATEGORIA: Record<string, number> = {
  uniforme: 4,
  cinturon: 2,
  proteccion: 3,
};
