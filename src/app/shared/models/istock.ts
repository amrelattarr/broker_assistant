export interface Istock {
    stockId: number;
    englishName: string;
    value: number;
    symbol: string;
    open: number;
    close: number;
    change: number;
    buySellInvests: any[] | null;
    infos: any[] | null;
  }
