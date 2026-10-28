import {mockCheckUrl} from './mockServer';


type State = "success" | "error" | "loading" | "invalid" | "idle" ;

function isValidUrl(url: string): boolean {
    try {
        const newUrl = new URL(url);
        return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch {
        return false;
    }
}

function throttle<T>(
  callback: (value: T) => void,
  delay: number
): (value: T) => void {
  let lastRun = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let latestValue: T;

  return (value: T) => {
    latestValue = value;

    const remaining = delay - (Date.now() - lastRun);

    if (remaining <= 0) {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      lastRun = Date.now();
      callback(latestValue);
    } else if (timer === null) {
      timer = setTimeout(() => {
        timer = null;
        lastRun = Date.now();
        callback(latestValue);
      }, remaining);
    }
  };
}

async function checkUrl(url: string): Promise<void> {

    const inputElement = document.getElementById('urlInput') as HTMLInputElement;

    // Checking if the input has changed since the request was made
    if (inputElement && inputElement.value !== url) return;

    displayResult("Loading...", "loading");
    try {
        const result = await mockCheckUrl(url);

        // Checking if the input has changed while we were waiting for the result
        if (inputElement && inputElement.value !== url) return; 

        if (result.exists) {
            displayResult(`URL exists and is a ${result.type}.`, "success");
        } else {
            displayResult("URL does not exist.", "error");
        }
    } catch (error) {

        // Checking if user deleted or changed the input so we don't display an error for a URL that is no longer relevant
        if (inputElement && inputElement.value !== url) return; 

        displayResult("Error checking URL.", "error");
    }
}

const throttledCheckUrl = throttle(checkUrl, 500);

function handleInput(value: string): void {
    
    if (value.trim() === "") {
        displayResult("", "idle");
        return;
    }

    if (!isValidUrl(value)) {
        displayResult("Invalid URL", "invalid");
        return;
    }
    throttledCheckUrl(value);
}  

function displayResult(result: string, state: State): void{
    const resultElement = document.getElementById('result');
    if (resultElement) {
        resultElement.textContent = result;
        resultElement.dataset.state = state;
    }
}

function main(): void {
    const inputElement = document.getElementById('urlInput') as HTMLInputElement;
    
    if (inputElement) {
        inputElement.addEventListener('input', () => {
            const url = inputElement.value;
            handleInput(url);
        });
    }
}

main();