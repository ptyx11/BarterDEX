import React from 'react'
import classNames from 'classnames';
import { Clipboard } from '../';

import { observer, inject } from 'mobx-react';
import logo from '../../static/favicon.svg';
import arrow from '../../static/arrow.svg';
import circles from '../../static/circles.svg';
import check from '../../static/check.svg';
import { PassPhraseGenerator } from '../../../config/config';

@inject('app')
@observer
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passphrase: '',
            clicked: false,
            localStorage: false
        }
    }

    getClassState = (coin) => {
        const self = this;
        // const { loader } = this.props.app;
        // const activationLoader = loader.getLoader(4);
        return classNames({
            'login-button withBorder action centered primary': true,
            loading: this.state.clicked,
            withLocalStorage: this.state.localStorage
        })
    }

    getContainerState = () =>
         classNames({
             login: true,
             'login-localStorage': this.state.localStorage
         })

    componentDidMount = () => {
        if (typeof (Storage) !== 'undefined') {
            // Code for localStorage/sessionStorage.
            const passphrase = localStorage.getItem('passphrase');
            if (passphrase) {
                this.setState({ passphrase, localStorage: true });
                setTimeout(() => this.login(), 400);
            }
        }
    }

    updatePassphase = (passphrase) => {
        this.setState({ passphrase });
    }

    login = () => {
        this.setState({ clicked: true })
        this.props.app.login(this.state.passphrase)
    }

    renderLoader = () => (<div className="login-processing">
      <i className="loader-svg" dangerouslySetInnerHTML={{ __html: circles }} />
      <div>Logging in</div>
    </div>)

    render() {
        const { loader } = this.props.app;
        const loginLoader = loader.getLoader(1);
        const PassPhraseGenerated = PassPhraseGenerator.generatePassPhrase(256)

        return (
          <div className={this.getContainerState()}>
            <div className="Placeholder-bg"> <span /> </div>
            <section className="Placeholder-tagline">
              <i className="Placeholder-logo" dangerouslySetInnerHTML={{ __html: logo }} />
              <h1 className="Placeholder-text">Barter<strong>DEX</strong></h1>
              { this.state.localStorage && this.renderLoader() }
              <section className="form">
                <div onClick={() => this.setState({ passphraseNotice: true, passphrase: PassPhraseGenerated })} className="login-newpassphrase">
                  <Clipboard copyLabel="Generate a new passphrase" value={PassPhraseGenerated} />
                </div>

                <textarea
                  autoFocus
                  name="form-field-name"
                  placeholder="Enter here your passphrase"
                  value={this.state.passphrase}
                  style={{ fontSize: 18, minWidth: '260px' }}
                  onChange={(e) => this.updatePassphase(e.target.value)}
                />
                { this.state.passphraseNotice ? <button onClick={() => this.setState({ passphraseNotice: false })} className="action align-left danger login-passphrase-notice">
                  <span><strong>I've keept a secure backup of the passpharase, <u>it can't be retreiveid!</u></strong></span>
                  <i dangerouslySetInnerHTML={{ __html: check }} />

                </button> :
                <button
                  disabled={this.state.passphrase.length === 0 || loginLoader}
                  className={this.getClassState()}
                  onClick={() => this.login()}
                >
                  <span>{ loginLoader || 'Login' }</span>
                  <i dangerouslySetInnerHTML={{ __html: arrow }} />
                </button>

            }


              </section>
            </section>
          </div>
        );
    }
}


export default Login
