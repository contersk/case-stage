import * as Create from "./Create";
import * as GetAll from "./GetAll";
import * as GetByID from "./GetByID";
import * as UpdateByID from "./UpdateByID";
import * as DeleteByID from "./DeleteByID";
export type { IAreasRepository } from "./IAreasRepository";

export const AreasRepository = {
  ...Create,
  ...GetAll,
  ...GetByID,
  ...UpdateByID,
  ...DeleteByID,
};
