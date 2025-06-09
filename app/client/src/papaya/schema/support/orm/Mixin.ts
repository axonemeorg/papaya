import { z, ZodType } from 'zod'

class NaturalMixin {
  public static $ephemeral<E extends z.ZodRawShape>($ephemeral: E) {
    return {
      $ephemeral: z.object($ephemeral).optional(),
    }
  }

  public static $derived<D extends z.ZodRawShape>($derived: D) {
    return {
      $derived: z.object($derived),
    }
  }

  public static _id(schema: ZodType = z.string()) {
    return {
      _id: schema,
    }
  }
}

class IntrinsicMixin {
  public static natural = {
    $ephemeral: NaturalMixin.$ephemeral,
  }
}

class DerivedMixin {
  public static timestamps() {
    return {
      createdAt: z.string(),
      updatedAt: z.string().nullable().optional(),
    }
  }

  public static belongsToJournal() {
    return {
      journalId: z.string(),
    }
  }

  public static natural = {
    $derived: NaturalMixin.$derived,
    _id: NaturalMixin._id,
  }
}

export class Mixin {
  static intrinsic = IntrinsicMixin
  static derived = DerivedMixin
}
