import { DevilBasicResponse } from "../devil-basic-response";

export interface DevilSslIssueResponse extends DevilBasicResponse{
    ip: string;
    cert_cn: string;
    cert_sha1: string;
    cert_issued: Date;
    cert_expires: Date;
}
