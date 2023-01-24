import loading from "loading-cli";

let instance: loading.Loading | null = null;

export const cliLoading = (initialMessage: string = 'Loading...') => {
    if (!instance) {
        instance = loading(initialMessage).start();
    }

    return instance;
}
