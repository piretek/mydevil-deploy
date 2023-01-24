export interface DevilWebsite {
    id: number;
    user_id: number;
    domain: string;
    www_type: string;
    directory: string;
    active: boolean;
    info: string;
    option_gzip: boolean;
    option_sslonly: boolean;
    option_plnet: boolean;
    option_php_eval: boolean;
    option_php_exec: boolean;
    option_php_openbasedir: string;
    option_cache: number;
    option_cache_cookie: string;
    option_cache_debug: boolean;
    option_waf: 0 | 1 | 2 | 3 | 4 | 5;
    option_stats_anonymize: boolean;
    option_stats_exclude: string;
    option_processes: number;
    option_tls_min: '1.0' | '1.1' | '1.2' | '1.3';
}
