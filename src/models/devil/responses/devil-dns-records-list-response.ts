import { DevilDnsRecord } from "../../devil-dns-record";
import { DevilBasicResponse } from "../devil-basic-response";

export interface DevilDnsRecordsListResponse extends DevilBasicResponse {
    domain: string,
    records: DevilDnsRecord[],
    output: null
}
