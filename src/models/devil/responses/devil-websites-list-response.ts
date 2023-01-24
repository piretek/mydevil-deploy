import { DevilBasicResponse } from "../devil-basic-response";
import { DevilWebsite } from "../../devil-website";

export interface DevilWebsitesListResponse extends DevilBasicResponse {
    websites: DevilWebsite[],
}
