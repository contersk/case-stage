import * as Create from "./Create";
import * as GetAll from "./GetAll";
import * as GetByID from "./GetByID";
import * as GetTree from "./GetTree";
import * as UpdateByID from "./UpdateByID";
import * as DeleteByID from "./DeleteByID";

export const ProcessesController = {
  ...Create,
  ...GetAll,
  ...GetByID,
  ...GetTree,
  ...UpdateByID,
  ...DeleteByID,
};
