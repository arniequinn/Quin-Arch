import { useCallback, useEffect, useState } from "react";
import { AreaUnit, DEFAULT_UNIT_BY_MARKET } from "./units";

const STORAGE_KEY = "quinarch_area_unit";

// The visitor's ft²/m² choice (R4). Until they choose, the unit follows their market (US and
// Canada ft², everyone else m²); once they choose, it's remembered in this browser. The stored
// choice is read after hydration so the prerendered HTML (always ft²) hydrates cleanly.
export function useAreaUnit(marketId = "us"): [AreaUnit, (unit: AreaUnit) => void] {
  const [chosen, setChosen] = useState<AreaUnit | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ft2" || saved === "m2") setChosen(saved);
    } catch {
      // storage blocked — keep the market default
    }
  }, []);

  const choose = useCallback((unit: AreaUnit) => {
    setChosen(unit);
    try {
      localStorage.setItem(STORAGE_KEY, unit);
    } catch {
      // storage blocked — the choice lasts for this page view only
    }
  }, []);

  return [chosen ?? DEFAULT_UNIT_BY_MARKET[marketId] ?? "ft2", choose];
}
