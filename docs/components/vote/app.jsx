import React from 'react';
import 'whatwg-fetch';
import * as api from "./api";
import VoteButton from './button/button';
import Influence from './influence.jsx';
import GithubMark from '../../assets/github-logo.svg';

function updateByProperty(array, property, propertyValue, update) {
  return array.map(item => {
    if(item[property] === propertyValue) {
      return update(item);
    } else {
      return item;
    }
  });
}

export default class VoteApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selfInfo: undefined,
      listInfo: undefined,
      isFetchingSelf: false,
      isVoting: 0
    };
  }

  isBrowserSupported() {
    return typeof localStorage === 'object';
  }

  componentDidMount() {
    if(!this.isBrowserSupported())
      return;

    let { selfInfo, listInfo } = this.state;

    if(api.isLoginActive()) {
      this.setState({
        isLoginActive: true
      });
      api.continueLogin().then(token => {
        window.localStorage.voteAppToken = token;
      });
    } else {
      if(!selfInfo) {
        this.updateSelf();
      }
      if(!listInfo) {
        this.updateList();
      }
    }
  }

  componentWillReceiveProps(props) {
    if(!this.isBrowserSupported())
      return;

    this.updateList(props);
  }

  updateSelf() {
    let { voteAppToken } = localStorage;
    if(voteAppToken) {
      this.setState({
        isFetchingSelf: true
      });
      api.getSelf(voteAppToken).catch(e => {
        this.setState({
          selfInfo: null,
          isFetchingSelf: false
        });
      }).then(result => {
        this.setState({
          selfInfo: result,
          isFetchingSelf: false
        });
      });
    }
  }

  updateList(props = this.props) {
    let { name } = props;
    let { voteAppToken } = localStorage;
    this.setState({
      isFetchingList: true
    });
    api.getList(voteAppToken, name).catch(e => {
      this.setState({
        listInfo: null,
        isFetchingList: false
      });
    }).then(result => {
      this.setState({
        listInfo: result,
        isFetchingList: false
      });
    });
  }

  localVote(itemId, voteName, diffValue, currencyName, score) {
    let { selfInfo, listInfo } = this.state;
    this.setState({
      isVoting: this.state.isVoting + 1,
      listInfo: listInfo && {
        ...listInfo,
        items: updateByProperty(listInfo.items, "id", itemId, item => ({
          ...item,
          votes: updateByProperty(item.votes, "name", voteName, vote => ({
            ...vote,
            votes: vote.votes + diffValue
          })),
          userVotes: updateByProperty(item.userVotes, "name", voteName, vote => ({
            ...vote,
            votes: vote.votes + diffValue
          })),
          score: item.score + score * diffValue
        }))
      },
      selfInfo: selfInfo && {
        ...selfInfo,
        currencies: updateByProperty(selfInfo.currencies, "name", currencyName, currency => ({
          ...currency,
          used: currency.used + diffValue,
          remaining: currency.remaining - diffValue
        }))
      }
    });
  }

  vote(itemId, voteName, diffValue, currencyName, score) {
    if(!diffValue) return;
    this.localVote(itemId, voteName, diffValue, currencyName, score);
    let { voteAppToken } = localStorage;
    api.vote(voteAppToken, itemId, voteName, diffValue).catch(e => {
      console.error(e);
      // revert local vote
      this.localVote(itemId, voteName, -diffValue, currencyName, score);
      this.setState({
        isVoting: this.state.isVoting - 1
      });
    }).then(() => {
      this.setState({
        isVoting: this.state.isVoting - 1
      });
    });
  }

  render() {
    let { name } = this.props;

    if(!this.isBrowserSupported())
      return <div>Your browser is not supported.</div>;

    let { selfInfo, listInfo, isVoting, isFetchingList, isFetchingSelf, isCreating, isLoginActive } = this.state;

    let { voteAppToken } = localStorage;

    if(isLoginActive) {
      return <div>Logging in...</div>;
    }

    const inProgress = isFetchingList || isFetchingSelf || isCreating || isVoting;

    let maxVoteInfo = listInfo && listInfo.possibleVotes.map(() => 0);

    if(listInfo) listInfo.items.forEach(item => {
      if(item.userVotes) {
        maxVoteInfo.forEach((max, idx) => {
          let votes = item.userVotes[idx].votes;
          if(votes > max)
            maxVoteInfo[idx] = votes;
        });
      }
    });
    listInfo && console.log(listInfo);
    return (
      <div className="vote-app">
        <div className="vote-app__influence">
          <div className="vote-app__top">
            <div className="vote-app__influence">
              <div className="vote-app__influence-description">
                <Influence className="vote-app__influence-section" type="normal"/>
                <Influence className="vote-app__influence-section" type="golden"/>
              </div>
              <div className="vote-app__influence-disclaimer">
                DISCLAIMER: Since this feature is its Alpha stages, the formula for calculating influence may change.
              </div>
            </div>
            <div className="vote-app__user-section">
              {this.renderSelf(inProgress)}
            </div>
          </div>
        </div>
        { listInfo && <div>
          <h1>{listInfo.displayName}</h1>
          <div>{listInfo.description}</div>
          <ul className="vote-app__items-list">
            { listInfo.items.map(item => <li key={item.id}>
              <div className="vote-app__item-card">
                <div className="vote-app__score-section">
                  <div className="vote-app__item-score">{item.score}</div>
                  {listInfo.possibleVotes.map((voteSettings, idx) => {
                    let vote = item.votes[idx];
                    let userVote = item.userVotes && item.userVotes[idx];
                    let currencyInfo = selfInfo && voteSettings.currency && this.findByName(selfInfo.currencies, voteSettings.currency);
                    let maximum = voteSettings.maximum || 1000; // infinity
                    let minimum = voteSettings.minimum || 0;
                    let value = (userVote && userVote.votes) ? userVote.votes: 0;
                    if(currencyInfo && currencyInfo.remaining + value < maximum) maximum = currencyInfo.remaining + value;
                    return <div className="vote-app__item-button">
                      <VoteButton
                        className={"vote-app__vote-" + voteSettings.name}
                        value={vote.votes}
                        myValue={value}
                        maxUp={userVote ? maximum - value : 0}
                        maxDown={userVote ? value - minimum : 0}
                        color={this.getColor(voteSettings.name)}
                        isLoggedIn = {!!voteAppToken}
                        onVote={(diffValue) => {
                          this.vote(item.id, voteSettings.name, diffValue, voteSettings.currency, voteSettings.score);
                        }}
                      />
                    </div>;
                  })}
                </div>
                <div className="vote-app__item-content">
                  <span className="vote-app__item-title">{item.title}</span>
                  <span>{item.description}</span>
                </div>
              </div>
            </li>)}
            { listInfo.isAdmin && <li className="vote-app__admin">
              <div><input type="text" value={this.state.newTitle} disabled={inProgress} onChange={e => this.setState({newTitle: e.target.value})} /></div>
              <div><textarea rows="4" value={this.state.newDescription} disabled={inProgress} onChange={e => this.setState({newDescription: e.target.value})} /></div>
              <div><button onClick={() => {
                const { newTitle, newDescription } = this.state;
                if(newTitle && newDescription) {
                  this.setState({
                    isCreating: true
                  });
                  api.createItem(voteAppToken, name, newTitle, newDescription).then(item => {
                    this.setState({
                      newTitle: "",
                      newDescription: "",
                      isCreating: false,
                      listInfo: listInfo && {
                        ...listInfo,
                        items: [
                          ...listInfo.items,
                          item
                        ]
                      }
                    });
                  });
                }
              }}>Create Item</button></div>
            </li> }
          </ul>
        </div> }
      </div>
    );
  }

  renderSelf (inProgress) {
    let { listInfo, selfInfo, isFetchingSelf } = this.state;
    if(!selfInfo) {
      if(isFetchingSelf) {
        return <div className="vote-app__self-info">Loading user info...</div>;
      }
      return <div className="vote-app__login-button"><button onClick={() => {
        api.startLogin(window.location + "");   
      }}>Login with Github <img src={GithubMark}/> </button></div>;
    } else {
      return <div className="vote-app__self-info">
        <div className="vote-app__userinfo" >
          <img alt={selfInfo.login} src={selfInfo.avatar} />
          {selfInfo.login}
        </div>
        { listInfo && <ul className="vote-app__currency-list">
          { selfInfo.currencies
            .filter(currency => listInfo.possibleVotes.some(voteSettings => voteSettings.currency === currency.name))
            .map(currency => <li className={"vote-app__currency-" + currency.name} title={`${currency.description}\nYou used ${currency.used} of a total of ${currency.value} ${currency.displayName}.`}>
            {currency.remaining} {currency.displayName}
          </li>) }
        </ul> }
        <div className="vote-app__button-area">
          <button className="vote-app__logout-button" onClick={() => {
            delete window.localStorage.voteAppToken;
            window.location.reload();
          }}>Logout</button>
          <button className="vote-app__update-button" disabled={inProgress} onClick={() => {
              this.updateSelf();
              this.updateList();
            }}>Update</button>
        </div>
      </div>;
    }
  }

  findByName(array, name) {
    for(var i = 0; i < array.length; i++)
      if(array[i].name === name)
        return array[i];
    return null;
  }

  getNiceVoteValues(maximum) {
    var arr = [];
    var b = true;
    for(var x = 1; x < maximum; x *= b ? 5 : 2, b = !b) {
      arr.push(x);
    }
    if(maximum)
      arr.push(maximum);
    return arr;
  }

  getStep(maximum) {
    return Math.floor(maximum / 20) * 2 || 1;
  }

  getColor(name) {
    switch(name) {
      case "influence": return "blue";
      case "golden": return "#bfa203";
      case "thumb": return "#535353";
    }
    return undefined;
  }
}
