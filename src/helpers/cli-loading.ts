import loading from "loading-cli";

let instance: loading.Loading | null = null;
let verbose = false;

export const cliLoading = (initialMessage: string = 'Loading...') => {
    if (!instance) {
        instance = loading(initialMessage).start();
    }

    return {
        loadText: (message: string) => {
            if (instance) {
                instance.text = message;
            }
        },
        info: (message: string) => {
            if (instance && verbose) instance.info(message);
        },
        warn: (message: string) => {
            if (instance && verbose) instance.warn(message);
        },
        succeed: (message: string) => {
            if (instance) instance.succeed(message);
        },
        fail: (message: string) => {
            if (instance) instance.fail(message);
        },
        stop: () => {
            if (instance) instance.stop();
        },
        exceptionHandler: (error: Error) => {
            if (instance) {
                instance.stop();
                instance.fail(error.message);
            }
        },
        setVerbose: (newValue: boolean) => {
            verbose = newValue;
        }
    }
}
