import mixpanel from 'mixpanel-browser';
mixpanel.init('9d5388aca7aa9a596a756d442846ac7c');

let env_check = true;// process.env.NODE_ENV === 'production';

let actions = {
  identify: (id) => {
    if (env_check) 
        return mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) 
        return mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check){
        return mixpanel.track(name, props);
    }   
  },
  people: {
    set: (props) => {
      if (env_check) 
        return mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;