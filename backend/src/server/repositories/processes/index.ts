import * as Create from "./Create";
import * as GetAll from "./GetAll";
import * as GetByID from "./GetByID";
import * as UpdateByID from "./UpdateByID";
import * as DeleteByID from "./DeleteByID";
export type {
  IProcessesRepository,
  ICreateProcessData,
  IUpdateProcessData,
  IProcessWithRelations,
} from "./IProcessesRepository";

export const ProcessesRepository = {
  ...Create,
  ...GetAll,
  ...GetByID,
  ...UpdateByID,
  ...DeleteByID,
};
