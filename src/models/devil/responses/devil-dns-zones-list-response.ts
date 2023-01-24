import { DevilBasicResponse } from "../devil-basic-response";
import { DevilDnsZone } from "../../devil-dns-zone";

export interface DevilDnsZonesListResponse extends DevilBasicResponse {
    domains: DevilDnsZone[],
    dns_list: string[]
}
