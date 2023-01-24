import { ColumnMap } from "./types/column-map";
import { WebsiteType } from "./config/enums/website-type.enum";

export interface DevilWebsitesList {
    domain_name: string;
    type: WebsiteType;
    dir: string;
}

export const DEVIL_WEBSITES_LIST_COLUMNS_MAP: ColumnMap<DevilWebsitesList> = {
    'Nazwa domeny': 'name',
    'Typ': 'type',
    'Katalog / Adres docelowy': 'dir'
};

export const convertToDevilWebsitesList = (stringRecords: string[]): DevilWebsitesList => {
    const [ domain_name, type, dir ] = stringRecords;
    return {
        domain_name,
        type: type as WebsiteType,
        dir
    };
}
