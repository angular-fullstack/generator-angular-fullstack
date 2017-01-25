let usedCurrencies = {
  influence: 100,
  goldenInfluence: 100
};
let totalCurrencies = {
  influence: 1000,
  goldenInfluence: 300
};
let lists = {
  todo: {
    possibleVotes: [
      {
        name: "influence",
        currency: "influence",
        score: 1,
        color: "blue"
      },
      {
        name: "golden",
        currency: "goldenInfluence",
        score: 1,
        color: "#bfa203"
      }
    ],
    items: [
      { id: "1234", list: "todo", title: "Finish up MVP documentation", description: "Take care for the remaining issues in the webpack.js.org repo which are relevant for the MVP.", influence: 15 },
      { id: "2345", list: "todo", title: "Review whole documentation", description: "Read over **all** of the documentation to find errors.", golden: 20 },
    ]
  }
};
let allItems = {
  "1234": lists.todo.items[0],
  "2345": lists.todo.items[1],
};

function delay(time) {
  return new Promise(function (fulfill) {
    setTimeout(fulfill, time);
  });
}

function clone(json) {
  return JSON.parse(JSON.stringify(json));
}

export function isLoginActive() {
  return /^\?login=/.test(window.location.search);
}

export function startLogin(callbackUrl) {
  window.location.search = "?login=" + encodeURIComponent(callbackUrl);
  return Promise.resolve();
}

export function continueLogin() {
  if(/^\?login=/.test(window.location.search)) {
    return delay(2000).then(() => {
      setTimeout(() => window.location = decodeURIComponent(window.location.search.substr(7), 100));
      return "developer";
    });
  }
  return Promise.resolve();
}

export function getSelf(token) {
  if(token !== "developer")
    return Promise.reject(new Error("Not logged in as developer"));
  return delay(500).then(() => ({
    login: "dev",
    name: "Developer",
    avatar: "https://github.com/webpack.png",
    currencies: [
      { name: "influence", displayName: "Influence", description: "Some **description**", value: totalCurrencies.influence, used: usedCurrencies.influence, remaining: totalCurrencies.influence - usedCurrencies.influence },
      { name: "goldenInfluence", displayName: "Golden Influence", description: "Some **description**", value: totalCurrencies.goldenInfluence, used: usedCurrencies.goldenInfluence, remaining: totalCurrencies.goldenInfluence - usedCurrencies.goldenInfluence }
    ]
  }));
}

export function getList(token, name) {
  const loggedIn = token === "developer";
  const listData = lists[name];
  return delay(500).then(() => ({
    name: name,
    displayName: "DEV: " + name,
    description: "Some **description**",
    lockable: true,
    deletable: true,
    archivable: true,
    isAdmin: true,
    possibleVotes: listData.possibleVotes,
    items: lists[name].items.map(item => {
      const votes = listData.possibleVotes.map(pv => ({
        name: pv.name,
        votes: (item[pv.name] || 0) + Math.floor(Math.random() * 100)
      }));
      const score = listData.possibleVotes.map((pv, i) => {
        return pv.score * votes[i].votes;
      }).reduce((a, b) => a + b, 0);
      return {
        id: item.id,
        list: item.list,
        title: item.title,
        description: item.description,
        votes,
        userVotes: loggedIn ? listData.possibleVotes.map(pv => ({
          name: pv.name,
          votes: item[pv.name] || 0
        })) : undefined,
        score
      };
    }).sort((a, b) => b.score - a.score)
  }));
}

export function createItem(token, list, title, description) {
  if(token !== "developer")
    return Promise.reject(new Error("Not logged in as developer"));
  let newItem = {
    id: Math.random() + "",
    list,
    title,
    description
  };
  allItems[newItem.id] = newItem;
  lists[list].items.push(newItem);
  return delay(500).then(() => ({
    ...newItem,
    votes: lists[list].possibleVotes.map(pv => ({
      name: pv.name,
      votes: 0
    })),
    userVotes: lists[list].possibleVotes.map(pv => ({
      name: pv.name,
      votes: 0
    })),
    score: 0
  }));
}

export function vote(token, itemId, voteName, value) {
  if(token !== "developer")
    return Promise.reject(new Error("Not logged in as developer"));
  var listId = allItems[itemId].list;
  let listData = lists[listId];
  let pv = listData.possibleVotes.filter(pv => pv.name === voteName)[0];
  if(pv.currency) {
    usedCurrencies[pv.currency] += value;
  }
  allItems[itemId][voteName] = (allItems[itemId][voteName] || 0) + value;
  return delay(500).then(() => ({
    ok: true
  }));
}
