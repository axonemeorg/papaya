import { ZiskMeta } from "@/types/schema";
import { createContext } from "react";

export type ZiskContext = ZiskMeta | null;

export const ZiskContext = createContext<ZiskContext>(null)
