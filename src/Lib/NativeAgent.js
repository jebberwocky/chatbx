

let agent = {}

if (window.AndroidNative) {
    agent = window.AndroidNative;
}

let actions = {
    toast: (data) => {
        if(agent.showToast)
            agent.showToast(data)
    },
    setMessage: (data) =>{
        if(agent.setMessage)
            agent.setMessage(JSON.stringify(data))
    }
}

export let NativeAgent = actions;
