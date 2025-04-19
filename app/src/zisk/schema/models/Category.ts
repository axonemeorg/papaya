import { z } from "zod";
import { DocumentFactory } from "../support/DocumentFactory";

// New
export class CategoryModel extends DocumentFactory
  .fromSchema({
    kind: z.literal('zisk:category'),
    categoryId: z.string(),
    label: z.string(),
  }) {};

CategoryModel.make({
  kind: 'zisk:category',
  

})