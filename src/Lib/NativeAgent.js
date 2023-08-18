

let agent = {}

if (window.AndroidNative) {
    agent = window.AndroidNative;
}

let actions = {
    toast: (data) => {
        agent.showToast(data)
    }
}

export let NativeAgent = actions;
